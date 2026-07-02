import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const FORUM_ENTRY_MARKER = '__FORUM_POST__'
const APPLY = process.argv.includes('--apply')

function loadEnv() {
  const envPath = resolve(process.cwd(), '.env')
  const env = {}

  for (const line of readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^([^#][^=]+)=(.*)$/)
    if (match) env[match[1].trim()] = match[2].trim()
  }

  return env
}

const env = loadEnv()
const base = env.STRAPI_URL?.replace(/\/$/, '')
const token = env.STRAPI_TOKEN

if (!base || !token) {
  throw new Error('Missing STRAPI_URL or STRAPI_TOKEN in .env')
}

const headers = {
  Authorization: `Bearer ${token}`,
  'Content-Type': 'application/json',
}

async function request(path, options = {}) {
  const response = await fetch(`${base}${path}`, {
    ...options,
    headers: {
      ...headers,
      ...(options.headers ?? {}),
    },
  })

  const text = await response.text()
  const body = text ? JSON.parse(text) : null

  if (!response.ok) {
    const message = body?.error?.message ?? response.statusText
    throw new Error(`${options.method ?? 'GET'} ${path} failed: ${response.status} ${message}`)
  }

  return body
}

async function ensureForumCollectionsExist() {
  const checks = [
    '/api/forum-posts?pagination[pageSize]=1',
    '/api/forum-comments?pagination[pageSize]=1',
    '/api/forum-likes?pagination[pageSize]=1',
    '/api/forum-categories?pagination[pageSize]=1',
  ]

  for (const path of checks) {
    await request(path)
  }
}

async function fetchLegacyEntries() {
  const path = `/api/entradas?pagination[page]=1&pagination[pageSize]=100&sort=updatedAt:DESC&filters[excerpt][$eq]=${encodeURIComponent(FORUM_ENTRY_MARKER)}`
  const response = await request(path)
  return response.data ?? []
}

async function existingMigratedPosts() {
  const response = await request('/api/forum-posts?fields[0]=legacyDocumentId&pagination[pageSize]=1000')
  return new Set((response.data ?? []).map(post => post.legacyDocumentId).filter(Boolean))
}

function parseContent(entry) {
  if (typeof entry.content === 'string') {
    return JSON.parse(entry.content)
  }

  if (entry.content && typeof entry.content === 'object') {
    return entry.content
  }

  return {}
}

function mediaIds(post) {
  return (post.media ?? [])
    .map(item => Number(item?.id))
    .filter(id => Number.isInteger(id) && id > 0)
}

function postPayload(entry, post) {
  const payload = {
    title: post.title || '',
    message: post.message || '',
    authorKey: post.authorKey || '',
    authorName: post.name || '',
    authorInitial: post.initial || '',
    avatarClass: post.avatarClass || '',
    avatarUrl: post.avatarUrl || '',
    legacyDocumentId: entry.documentId,
    legacyCreatedAt: post.createdAt || entry.createdAt,
    isPinned: false,
    isLocked: false,
  }

  const ids = mediaIds(post)
  if (ids.length) {
    payload.media = ids
  }

  return payload
}

function commentPayload(createdPost, comment) {
  return {
    message: comment.message || '',
    post: createdPost.documentId,
    authorKey: comment.authorKey || '',
    authorName: comment.name || '',
    authorInitial: comment.initial || '',
    avatarClass: comment.avatarClass || '',
    avatarUrl: comment.avatarUrl || '',
    legacyCommentId: String(comment.id ?? ''),
    legacyCreatedAt: comment.createdAt,
  }
}

function likePayload(createdPost, userKey) {
  return {
    post: createdPost.documentId,
    userKey,
  }
}

async function createRecord(collection, data) {
  const response = await request(`/api/${collection}`, {
    method: 'POST',
    body: JSON.stringify({ data }),
  })

  return response.data
}

async function main() {
  await ensureForumCollectionsExist()

  const legacyEntries = await fetchLegacyEntries()
  const migrated = await existingMigratedPosts()
  const candidates = legacyEntries.filter(entry => !migrated.has(entry.documentId))

  console.log(`Legacy forum entries: ${legacyEntries.length}`)
  console.log(`Already migrated: ${legacyEntries.length - candidates.length}`)
  console.log(`Pending migration: ${candidates.length}`)

  if (!APPLY) {
    console.log('Dry run only. Re-run with --apply to create forum-posts/forum-comments/forum-likes.')
    return
  }

  for (const entry of candidates) {
    const post = parseContent(entry)
    const createdPost = await createRecord('forum-posts', postPayload(entry, post))

    for (const comment of post.commentItems ?? []) {
      await createRecord('forum-comments', commentPayload(createdPost, comment))
    }

    for (const userKey of post.likedBy ?? []) {
      if (typeof userKey === 'string' && userKey) {
        await createRecord('forum-likes', likePayload(createdPost, userKey))
      }
    }

    console.log(`Migrated ${entry.documentId} -> ${createdPost.documentId}`)
  }
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
