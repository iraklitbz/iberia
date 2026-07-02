interface StrapiUser {
  id: number
  documentId?: string
  username: string
  email: string
  confirmed?: boolean
  blocked?: boolean
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

  return {
    ...currentUser,
    profileAvatar: await getStoredProfileAvatar(config, currentUser.id),
  }
})
