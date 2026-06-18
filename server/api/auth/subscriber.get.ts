interface StrapiRole {
  id: number
  name: string
  type: string
}

interface StrapiUser {
  id: number
  email: string
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

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const authorization = getHeader(event, 'authorization')

  if (!authorization) {
    throw createError({ statusCode: 401, message: 'Missing authorization header' })
  }

  setHeader(event, 'Cache-Control', 'private, no-store')

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
  const role = fullUser?.role

  return {
    isSubscriber: isSubscriberRole(role),
    role: role ?? null,
  }
})
