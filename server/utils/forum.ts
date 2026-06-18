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

interface StrapiUser extends ForumUser {
  role?: StrapiRole
}

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
