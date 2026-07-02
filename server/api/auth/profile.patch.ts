interface StrapiUser {
  id: number
  documentId?: string
  username: string
  email: string
  profileAvatar?: string | null
}

interface ProfileBody {
  username?: string
  profileAvatar?: string | null
  profileAvatarFileId?: number | null
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const authorization = getHeader(event, 'authorization')

  if (!authorization) {
    throw createError({ statusCode: 401, message: 'Missing authorization header' })
  }

  const body = await readBody<ProfileBody>(event)
  const username = body.username?.trim()
  const hasUsername = typeof body.username === 'string'
  const hasProfileAvatar = Object.prototype.hasOwnProperty.call(body, 'profileAvatar')
  const hasProfileAvatarFileId = typeof body.profileAvatarFileId === 'number'

  if (!hasUsername && !hasProfileAvatar) {
    throw createError({ statusCode: 400, message: 'No profile fields provided' })
  }

  if (hasUsername && (!username || username.length < 2 || username.length > 40)) {
    throw createError({ statusCode: 400, message: 'Invalid username' })
  }

  if (
    hasProfileAvatar
    && body.profileAvatar !== null
    && (typeof body.profileAvatar !== 'string' || body.profileAvatar.length > 1000)
  ) {
    throw createError({ statusCode: 400, message: 'Invalid profile avatar' })
  }

  setHeader(event, 'Cache-Control', 'private, no-store')

  const currentUser = await $fetch<StrapiUser>(`${config.public.strapiUrl}/api/users/me`, {
    headers: { Authorization: authorization },
  })

  let updatedUser = currentUser
  if (hasUsername) {
    updatedUser = await $fetch<StrapiUser>(`${config.public.strapiUrl}/api/users/${currentUser.id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${config.strapiToken}` },
      body: { username },
    })
  }

  if (hasProfileAvatar) {
    if (body.profileAvatar && hasProfileAvatarFileId) {
      await setStoredProfileAvatar(config, currentUser.id, body.profileAvatarFileId!)
    }
    else if (!body.profileAvatar) {
      await clearStoredProfileAvatar(config, currentUser.id)
    }
  }

  return {
    ...updatedUser,
    profileAvatar: await getStoredProfileAvatar(config, currentUser.id),
  }
})
