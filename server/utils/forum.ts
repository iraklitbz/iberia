import type { H3Event } from 'h3'

export const FORUM_ENTRY_MARKER = '__FORUM_POST__'
const FORUM_POST_COLLECTION = 'forum-posts'
const FORUM_COMMENT_COLLECTION = 'forum-comments'
const FORUM_LIKE_COLLECTION = 'forum-likes'
const LEGACY_COLLECTION = 'entradas'
const DEFAULT_FORUM_SECTION = 'forum'
const FORUM_SECTION_TITLE_PREFIX = /^\[forum-section:([a-z0-9-]+)\]\s*/i
const FORUM_DOCUMENTS_MARKER = '\n\n<!-- forum-documents:'
const FORUM_DOCUMENTS_END_MARKER = ' -->'

interface StrapiRole {
  id: number
  name: string
  type: string
}

export interface ForumUser {
  id: number
  email: string
  username: string
}

interface StrapiUser extends ForumUser {
  role?: StrapiRole
}

interface StrapiMedia {
  id?: number
  documentId?: string
  url?: string
  name?: string
  mime?: string
}

interface ForumMediaItem {
  id?: number
  type?: string
  src?: string
  name?: string
}

interface ForumCommentEntry {
  documentId: string
  message?: string
  authorKey?: string
  authorName?: string
  authorInitial?: string
  avatarClass?: string
  avatarUrl?: string
  legacyCommentId?: string
  legacyCreatedAt?: string
  createdAt?: string
}

interface ForumLikeEntry {
  documentId: string
  userKey?: string
}

export interface ForumStrapiEntry {
  documentId: string
  title?: string
  message?: string
  media?: StrapiMedia[]
  comments?: ForumCommentEntry[]
  likes?: ForumLikeEntry[]
  authorKey?: string
  authorName?: string
  authorInitial?: string
  avatarClass?: string
  avatarUrl?: string
  legacyCreatedAt?: string
  createdAt?: string
  content?: unknown
  excerpt?: string | null
}

export interface StoredForumEntry extends ForumStrapiEntry {
  collection: typeof FORUM_POST_COLLECTION | typeof LEGACY_COLLECTION
}

let cachedAdminToken: string | null = null

function normalizeUser(data: StrapiUser | StrapiUser[] | { data?: StrapiUser | StrapiUser[] }): StrapiUser | null {
  const value = 'data' in data && data.data ? data.data : data
  if (Array.isArray(value)) return value[0] ?? null
  return value ?? null
}

function isSubscriberRole(role: StrapiRole | undefined): boolean {
  return role?.name === 'Suscriptor' || role?.type === 'suscriptor'
}

export function forumUserKey(user: ForumUser): string {
  return `user:${user.id}`
}

export async function requireForumSubscriber(event: H3Event): Promise<ForumUser> {
  const config = useRuntimeConfig(event)
  const authorization = getHeader(event, 'authorization')

  if (!authorization) {
    throw createError({ statusCode: 401, statusMessage: 'Missing authorization header' })
  }

  const currentUser = await $fetch<StrapiUser>(`${config.public.strapiUrl}/api/users/me`, {
    headers: { Authorization: authorization },
  })

  const user = await $fetch<StrapiUser | StrapiUser[] | { data?: StrapiUser | StrapiUser[] }>(
    `${config.public.strapiUrl}/api/users?filters[email][$eq]=${encodeURIComponent(currentUser.email)}&populate=role`,
    {
      headers: { Authorization: `Bearer ${config.strapiToken}` },
    },
  )

  const fullUser = normalizeUser(user)
  if (!isSubscriberRole(fullUser?.role)) {
    throw createError({ statusCode: 403, statusMessage: 'Subscriber access required' })
  }

  return currentUser
}

export function strapiAuthHeaders(event: H3Event): Record<string, string> {
  const config = useRuntimeConfig(event)
  return { Authorization: `Bearer ${config.strapiToken}` }
}

async function strapiAdminToken(event: H3Event): Promise<string> {
  if (cachedAdminToken) {
    return cachedAdminToken
  }

  const config = useRuntimeConfig(event)
  if (!config.strapiAdminEmail || !config.strapiAdminPassword) {
    throw createError({ statusCode: 500, message: 'Missing Strapi admin credentials' })
  }

  const login = await $fetch<{ data: { token?: string } }>(`${config.public.strapiUrl}/admin/login`, {
    method: 'POST',
    body: {
      email: config.strapiAdminEmail,
      password: config.strapiAdminPassword,
    },
  })

  if (!login.data.token) {
    throw createError({ statusCode: 502, message: 'Strapi admin login failed' })
  }

  cachedAdminToken = login.data.token
  return cachedAdminToken
}

export async function strapiAdminHeaders(event: H3Event): Promise<Record<string, string>> {
  return { Authorization: `Bearer ${await strapiAdminToken(event)}` }
}

function isMissingCollection(error: unknown): boolean {
  return typeof error === 'object'
    && error !== null
    && 'statusCode' in error
    && [404, 405].includes((error as { statusCode?: number }).statusCode ?? 0)
}

function parseForumContent(content: unknown): Record<string, unknown> {
  if (typeof content === 'string') {
    return JSON.parse(content)
  }

  if (content && typeof content === 'object' && !Array.isArray(content)) {
    return content as Record<string, unknown>
  }

  return {}
}

function forumSlug(title: string): string {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80)

  return `forum-${slug || 'post'}-${Date.now()}`
}

function legacyForumEntryData(title: string, post: Record<string, unknown>) {
  return {
    title: `${FORUM_ENTRY_MARKER} ${title}`.slice(0, 255),
    slug: forumSlug(title),
    content: JSON.stringify(post),
    excerpt: FORUM_ENTRY_MARKER,
    acceso: 'publico',
    publishedAt: new Date().toISOString(),
  }
}

function forumMediaItems(post: Record<string, unknown>) {
  if (!Array.isArray(post.media)) return []

  return post.media
    .filter((item): item is ForumMediaItem => Boolean(item) && typeof item === 'object')
}

function mediaIds(items: ForumMediaItem[]) {
  return items
    .map((item) => {
      if (!('id' in item)) return null
      return Number(item.id)
    })
    .filter((id): id is number => Number.isInteger(id) && id > 0)
}

function forumDocumentItems(post: Record<string, unknown>) {
  return forumMediaItems(post).filter(item => item.type === 'document' && item.src && item.name)
}

function stripForumDocumentMetadata(message: string) {
  const start = message.indexOf(FORUM_DOCUMENTS_MARKER)
  if (start === -1) return message

  const end = message.indexOf(FORUM_DOCUMENTS_END_MARKER, start + FORUM_DOCUMENTS_MARKER.length)
  if (end === -1) return message.slice(0, start).trimEnd()

  return `${message.slice(0, start)}${message.slice(end + FORUM_DOCUMENTS_END_MARKER.length)}`.trimEnd()
}

function parseForumDocumentMetadata(message: string): ForumMediaItem[] {
  const start = message.indexOf(FORUM_DOCUMENTS_MARKER)
  if (start === -1) return []

  const end = message.indexOf(FORUM_DOCUMENTS_END_MARKER, start + FORUM_DOCUMENTS_MARKER.length)
  if (end === -1) return []

  try {
    const encoded = message.slice(start + FORUM_DOCUMENTS_MARKER.length, end)
    const parsed = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8'))
    if (!Array.isArray(parsed)) return []

    return parsed.flatMap((item) => {
      if (!item || typeof item !== 'object') return []
      const media = item as ForumMediaItem
      if (media.type !== 'document' || !media.src || !media.name) return []

      return [{
        id: Number.isInteger(Number(media.id)) ? Number(media.id) : Date.now(),
        type: 'document',
        src: media.src,
        name: media.name,
      }]
    })
  }
  catch {
    return []
  }
}

function forumDocumentUrl(postId: string, item: ForumMediaItem) {
  return `/api/forum/documents/${encodeURIComponent(postId)}/${encodeURIComponent(String(item.id))}/${encodeURIComponent(item.name || 'document')}`
}

export function forumDocumentItemsFromEntry(entry: StoredForumEntry): ForumMediaItem[] {
  if (entry.collection === FORUM_POST_COLLECTION) {
    return parseForumDocumentMetadata(entry.message || '')
  }

  const post = parseForumContent(entry.content)
  return forumDocumentItems(post)
}

function appendForumDocumentMetadata(message: string, documents: ForumMediaItem[]) {
  const cleanMessage = stripForumDocumentMetadata(message)
  if (!documents.length) return cleanMessage

  const payload = documents.map(item => ({
    id: item.id,
    type: 'document',
    src: item.src,
    name: item.name,
  }))
  const encoded = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url')

  return `${cleanMessage}${FORUM_DOCUMENTS_MARKER}${encoded}${FORUM_DOCUMENTS_END_MARKER}`
}

function forumPostEntryData(title: string, post: Record<string, unknown>) {
  const section = typeof post.section === 'string' && post.section ? post.section : DEFAULT_FORUM_SECTION
  const message = typeof post.message === 'string' ? post.message : ''
  const mediaItems = forumMediaItems(post)
  const documentItems = forumDocumentItems(post)
  const relationMediaItems = mediaItems.filter(item => item.type !== 'document')
  const data: Record<string, unknown> = {
    title: `[forum-section:${section}] ${title}`.slice(0, 255),
    message: appendForumDocumentMetadata(message, documentItems),
    authorKey: typeof post.authorKey === 'string' ? post.authorKey : '',
    authorName: typeof post.name === 'string' ? post.name : '',
    authorInitial: typeof post.initial === 'string' ? post.initial : '',
    avatarClass: typeof post.avatarClass === 'string' ? post.avatarClass : '',
    avatarUrl: typeof post.avatarUrl === 'string' ? post.avatarUrl : '',
    legacyCreatedAt: typeof post.createdAt === 'string' ? post.createdAt : undefined,
    isPinned: false,
    isLocked: false,
  }

  const ids = mediaIds(relationMediaItems)
  if (ids.length) {
    data.media = ids
  }

  return data
}

function parseForumTitle(rawTitle: string | undefined) {
  const title = rawTitle || ''
  const match = title.match(FORUM_SECTION_TITLE_PREFIX)

  return {
    section: match?.[1] || DEFAULT_FORUM_SECTION,
    title: title.replace(FORUM_SECTION_TITLE_PREFIX, ''),
  }
}

function absoluteStrapiUrl(event: H3Event, url: string) {
  const config = useRuntimeConfig(event)
  return url.startsWith('http') ? url : new URL(url, config.public.strapiUrl).toString()
}

function mapMedia(event: H3Event, media: StrapiMedia[] | undefined) {
  return (media ?? []).flatMap((item) => {
    if (!item.url) return []
    return [{
      id: item.id ?? Date.now(),
      type: item.mime?.startsWith('image/')
        ? 'image'
        : item.mime?.startsWith('video/')
          ? 'video'
          : 'document',
      src: absoluteStrapiUrl(event, item.url),
      name: item.name || 'forum-upload',
    }]
  })
}

function mapForumComment(comment: ForumCommentEntry) {
  const name = comment.authorName || ''
  return {
    id: comment.legacyCommentId || comment.documentId,
    name,
    initial: comment.authorInitial || name[0]?.toUpperCase() || '',
    authorKey: comment.authorKey,
    message: comment.message || '',
    createdAt: comment.legacyCreatedAt || comment.createdAt || new Date().toISOString(),
    avatarClass: comment.avatarClass || 'bg-zinc-500',
    avatarUrl: comment.avatarUrl,
  }
}

function mapForumPostEntry(event: H3Event, entry: StoredForumEntry) {
  const name = entry.authorName || ''
  const parsedTitle = parseForumTitle(entry.title)
  const commentItems = (entry.comments ?? []).map(mapForumComment)
  const likedBy = (entry.likes ?? []).flatMap(like => like.userKey ? [like.userKey] : [])
  const rawMessage = entry.message || ''
  const relatedMedia = mapMedia(event, entry.media)
  const documentMedia = parseForumDocumentMetadata(rawMessage).map(item => ({
    ...item,
    src: forumDocumentUrl(entry.documentId, item),
  }))
  const relatedMediaIds = new Set(relatedMedia.map(item => item.id))

  return {
    id: entry.documentId,
    name,
    initial: entry.authorInitial || name[0]?.toUpperCase() || '',
    authorKey: entry.authorKey,
    title: parsedTitle.title,
    section: parsedTitle.section,
    message: stripForumDocumentMetadata(rawMessage),
    media: [
      ...relatedMedia,
      ...documentMedia.filter(item => !relatedMediaIds.has(item.id ?? 0)),
    ],
    commentItems,
    comments: commentItems.length,
    likes: likedBy.length,
    likedBy,
    createdAt: entry.legacyCreatedAt || entry.createdAt || new Date().toISOString(),
    avatarClass: entry.avatarClass || 'bg-violet-600',
    avatarUrl: entry.avatarUrl,
  }
}

async function withForumCollection<T>(
  event: H3Event,
  action: (collection: typeof FORUM_POST_COLLECTION | typeof LEGACY_COLLECTION) => Promise<T>,
): Promise<T> {
  try {
    return await action(FORUM_POST_COLLECTION)
  }
  catch (error) {
    if (!isMissingCollection(error)) {
      throw error
    }

    const config = useRuntimeConfig(event)
    if (!config.forumLegacyFallback) {
      throw createError({
        statusCode: 503,
        message: 'Forum content types are not deployed and legacy fallback is disabled',
      })
    }

    return await action(LEGACY_COLLECTION)
  }
}

function forumPopulateQuery() {
  return [
    'populate[media]=true',
    'populate[comments][sort][0]=legacyCreatedAt:asc',
    'populate[comments][sort][1]=createdAt:asc',
    'populate[likes]=true',
  ].join('&')
}

export function forumPostFromEntry(event: H3Event, entry: StoredForumEntry): Record<string, unknown> {
  if (entry.collection === FORUM_POST_COLLECTION) {
    return mapForumPostEntry(event, entry)
  }

  return parseForumContent(entry.content)
}

export async function getForumEntry(event: H3Event, id: string): Promise<StoredForumEntry> {
  const config = useRuntimeConfig(event)

  return await withForumCollection(event, async (collection) => {
    if (collection === LEGACY_COLLECTION) {
      const response = await $fetch<{ data: ForumStrapiEntry }>(
        `${config.public.strapiUrl}/api/entradas/${id}`,
        {
          headers: strapiAuthHeaders(event),
        },
      )

      return { ...response.data, collection }
    }

    const response = await $fetch<{ data: ForumStrapiEntry }>(
      `${config.public.strapiUrl}/api/${collection}/${id}?${forumPopulateQuery()}`,
      {
        headers: strapiAuthHeaders(event),
      },
    )

    return { ...response.data, collection }
  })
}

export async function listForumEntries(event: H3Event): Promise<StoredForumEntry[]> {
  const config = useRuntimeConfig(event)

  return await withForumCollection(event, async (collection) => {
    if (collection === LEGACY_COLLECTION) {
      const response = await $fetch<{ data: ForumStrapiEntry[] }>(
        `${config.public.strapiUrl}/api/entradas?pagination[page]=1&pagination[pageSize]=100&sort=updatedAt:DESC&filters[excerpt][$eq]=${FORUM_ENTRY_MARKER}`,
        {
          headers: strapiAuthHeaders(event),
        },
      )

      return (response.data ?? []).map(entry => ({ ...entry, collection }))
    }

    const response = await $fetch<{ data: ForumStrapiEntry[] }>(
      `${config.public.strapiUrl}/api/${collection}?pagination[page]=1&pagination[pageSize]=100&sort[0]=isPinned:DESC&sort[1]=createdAt:DESC&${forumPopulateQuery()}`,
      {
        headers: strapiAuthHeaders(event),
      },
    )

    return (response.data ?? []).map(entry => ({ ...entry, collection }))
  })
}

async function createForumPostComments(event: H3Event, postId: string, comments: unknown) {
  if (!Array.isArray(comments)) return
  const config = useRuntimeConfig(event)

  for (const comment of comments) {
    if (!comment || typeof comment !== 'object') continue
    const item = comment as Record<string, unknown>
    const message = typeof item.message === 'string' ? item.message : ''
    if (!message) continue

    await $fetch(`${config.public.strapiUrl}/api/${FORUM_COMMENT_COLLECTION}`, {
      method: 'POST',
      headers: strapiAuthHeaders(event),
      body: {
        data: {
          message,
          post: postId,
          authorKey: typeof item.authorKey === 'string' ? item.authorKey : '',
          authorName: typeof item.name === 'string' ? item.name : '',
          authorInitial: typeof item.initial === 'string' ? item.initial : '',
          avatarClass: typeof item.avatarClass === 'string' ? item.avatarClass : '',
          avatarUrl: typeof item.avatarUrl === 'string' ? item.avatarUrl : '',
          legacyCommentId: String(item.id ?? ''),
          legacyCreatedAt: typeof item.createdAt === 'string' ? item.createdAt : undefined,
        },
      },
    })
  }
}

async function createForumPostLikes(event: H3Event, postId: string, likedBy: unknown) {
  if (!Array.isArray(likedBy)) return
  const config = useRuntimeConfig(event)

  for (const userKey of likedBy) {
    if (typeof userKey !== 'string' || !userKey) continue

    await $fetch(`${config.public.strapiUrl}/api/${FORUM_LIKE_COLLECTION}`, {
      method: 'POST',
      headers: strapiAuthHeaders(event),
      body: {
        data: {
          post: postId,
          userKey,
        },
      },
    })
  }
}

export async function createForumEntry(
  event: H3Event,
  title: string,
  post: Record<string, unknown>,
): Promise<ForumStrapiEntry> {
  const config = useRuntimeConfig(event)

  try {
    const response = await $fetch<{ data: ForumStrapiEntry }>(
      `${config.public.strapiUrl}/api/${FORUM_POST_COLLECTION}`,
      {
        method: 'POST',
        headers: strapiAuthHeaders(event),
        body: {
          data: forumPostEntryData(title, post),
        },
      },
    )

    await createForumPostComments(event, response.data.documentId, post.commentItems)
    await createForumPostLikes(event, response.data.documentId, post.likedBy)

    return response.data
  }
  catch (error) {
    if (isMissingCollection(error)) {
      throw createError({
        statusCode: 503,
        message: 'Forum content type is not deployed in Strapi. Install forum-posts and restart Strapi before creating forum posts.',
      })
    }

    throw error
  }
}

async function syncForumComments(event: H3Event, existing: StoredForumEntry, post: Record<string, unknown>) {
  if (!Array.isArray(post.commentItems)) return

  const config = useRuntimeConfig(event)
  const existingComments = existing.comments ?? []
  const nextIds = new Set(post.commentItems.map(comment => forumItemId(comment)))

  for (const comment of existingComments) {
    const id = comment.legacyCommentId || comment.documentId
    if (!nextIds.has(id)) {
      await $fetch(`${config.public.strapiUrl}/api/${FORUM_COMMENT_COLLECTION}/${comment.documentId}`, {
        method: 'DELETE',
        headers: strapiAuthHeaders(event),
      })
    }
  }

  const existingIds = new Set(existingComments.map(comment => comment.legacyCommentId || comment.documentId))
  const newComments = post.commentItems.filter(comment => !existingIds.has(forumItemId(comment)))
  await createForumPostComments(event, existing.documentId, newComments)
}

function forumItemId(item: unknown) {
  if (!item || typeof item !== 'object' || !('id' in item)) {
    return ''
  }

  return String((item as { id?: unknown }).id ?? '')
}

async function syncForumLikes(event: H3Event, existing: StoredForumEntry, post: Record<string, unknown>) {
  if (!Array.isArray(post.likedBy)) return

  const existingKeys = new Set((existing.likes ?? []).flatMap(like => like.userKey ? [like.userKey] : []))
  const nextKeys = [...new Set(post.likedBy.filter((key): key is string => typeof key === 'string' && key))]
  const missingKeys = nextKeys.filter(key => !existingKeys.has(key))

  await createForumPostLikes(event, existing.documentId, missingKeys)
}

export async function updateForumEntry(
  event: H3Event,
  id: string,
  collection: string,
  title: string,
  post: Record<string, unknown>,
): Promise<void> {
  const config = useRuntimeConfig(event)

  if (collection === FORUM_POST_COLLECTION) {
    const existing = await getForumEntry(event, id)
    await $fetch(`${config.public.strapiUrl}/api/${collection}/${id}`, {
      method: 'PUT',
      headers: strapiAuthHeaders(event),
      body: {
        data: forumPostEntryData(title, post),
      },
    })

    await syncForumComments(event, existing, post)
    await syncForumLikes(event, existing, post)
    return
  }

  await $fetch(`${config.public.strapiUrl}/api/${collection}/${id}?status=published`, {
    method: 'PUT',
    headers: strapiAuthHeaders(event),
    body: {
      data: legacyForumEntryData(title, post),
    },
  })
}

export async function deleteForumEntry(event: H3Event, id: string, collection: string): Promise<void> {
  const config = useRuntimeConfig(event)

  await $fetch(`${config.public.strapiUrl}/api/${collection}/${id}`, {
    method: 'DELETE',
    headers: strapiAuthHeaders(event),
  })
}
