interface UploadedFile {
  id: number
  url: string
  name: string
  mime: string
}

interface StrapiUser {
  id: number
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const authorization = getHeader(event, 'authorization')

  if (!authorization) {
    throw createError({ statusCode: 401, message: 'Missing authorization header' })
  }

  const currentUser = await $fetch<StrapiUser>(`${config.public.strapiUrl}/api/users/me`, {
    headers: { Authorization: authorization },
  })

  const files = await readMultipartFormData(event)
  const file = files?.find(item => item.name === 'file' && item.data)

  if (!file) {
    throw createError({ statusCode: 400, message: 'Missing file' })
  }

  if (!file.type?.startsWith('image/')) {
    throw createError({ statusCode: 400, message: 'Only image files are allowed' })
  }

  if (file.data.byteLength > 2 * 1024 * 1024) {
    throw createError({ statusCode: 413, message: 'Image is too large' })
  }

  setHeader(event, 'Cache-Control', 'private, no-store')

  const formData = new FormData()
  const blob = new Blob([file.data], { type: file.type })
  formData.append('files', blob, file.filename ?? 'profile-avatar')
  formData.append('fileInfo', JSON.stringify({ alternativeText: profileAvatarMarker(currentUser.id) }))

  const uploaded = await $fetch<UploadedFile[]>(`${config.public.strapiUrl}/api/upload`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${config.strapiToken}` },
    body: formData,
  })

  const first = uploaded[0]
  if (!first?.url) {
    throw createError({ statusCode: 502, message: 'Upload failed' })
  }

  const src = first.url.startsWith('http')
    ? first.url
    : new URL(first.url, config.public.strapiUrl).toString()

  return {
    id: first.id,
    src,
    name: first.name,
    type: first.mime?.startsWith('image/') ? 'image' : 'file',
  }
})
