import type { H3Event } from 'h3'

export const FORUM_ENTRY_MARKER = '__FORUM_POST__'

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

export interface ForumStrapiEntry {
  documentId: string
  content?: string | null
  createdAt?: string
  excerpt?: string | null
}

interface StrapiUser extends ForumUser {
  role?: StrapiRole
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
    throw createError({ statusCode: 401, message: 'Missing authorization header' })
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
    throw createError({ statusCode: 403, message: 'Subscriber access required' })
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

export async function getForumEntry(event: H3Event, id: string): Promise<ForumStrapiEntry> {
  const config = useRuntimeConfig(event)
  const response = await $fetch<{ data: ForumStrapiEntry }>(
    `${config.public.strapiUrl}/content-manager/collection-types/api::entrada.entrada/${id}`,
    {
      headers: await strapiAdminHeaders(event),
    },
  )

  return response.data
}

export async function listForumEntries(event: H3Event): Promise<ForumStrapiEntry[]> {
  const config = useRuntimeConfig(event)
  const response = await $fetch<{ results: ForumStrapiEntry[] }>(
    `${config.public.strapiUrl}/content-manager/collection-types/api::entrada.entrada?page=1&pageSize=100&sort=createdAt:DESC`,
    {
      headers: await strapiAdminHeaders(event),
    },
  )

  return (response.results ?? []).filter(entry => entry.excerpt === FORUM_ENTRY_MARKER)
}
