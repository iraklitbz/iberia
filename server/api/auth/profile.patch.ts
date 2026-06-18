interface StrapiUser {
  id: number
  documentId?: string
  username: string
  email: string
}

interface ProfileBody {
  username?: string
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const authorization = getHeader(event, 'authorization')

  if (!authorization) {
    throw createError({ statusCode: 401, message: 'Missing authorization header' })
  }

  const body = await readBody<ProfileBody>(event)
  const username = body.username?.trim()

  if (!username || username.length < 2 || username.length > 40) {
    throw createError({ statusCode: 400, message: 'Invalid username' })
  }

  setHeader(event, 'Cache-Control', 'private, no-store')

  const currentUser = await $fetch<StrapiUser>(`${config.public.strapiUrl}/api/users/me`, {
    headers: { Authorization: authorization },
  })

  const updatedUser = await $fetch<StrapiUser>(`${config.public.strapiUrl}/api/users/${currentUser.id}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${config.strapiToken}` },
    body: { username },
  })

  return updatedUser
})
