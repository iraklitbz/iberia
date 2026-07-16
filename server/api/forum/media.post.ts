export default defineEventHandler(async (event) => {
  await requireForumSubscriber(event)

  const files = await readMultipartFormData(event)
  const file = files?.find(item => item.name === 'file' && item.data)

  if (!file) {
    throw createError({ statusCode: 400, message: 'Missing file' })
  }

  setHeader(event, 'Cache-Control', 'private, no-store')

  const config = useRuntimeConfig(event)
  const formData = new FormData()
  const blob = new Blob([file.data], { type: file.type ?? 'application/octet-stream' })
  formData.append('files', blob, file.filename ?? 'forum-upload')

  const uploaded = await $fetch<Array<{ id: number, url: string, name: string, mime: string }>>(
    `${config.public.strapiUrl}/api/upload`,
    {
      method: 'POST',
      headers: strapiAuthHeaders(event),
      body: formData,
    },
  )

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
    type: first.mime?.startsWith('image/')
      ? 'image'
      : first.mime?.startsWith('video/')
        ? 'video'
        : 'document',
  }
})
