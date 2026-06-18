export default defineEventHandler(async (event) => {
  await requireForumSubscriber(event)

  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, message: 'Missing post id' })
  }

  const body = await readBody<Record<string, unknown>>(event)
  const config = useRuntimeConfig(event)

  const existing = await getForumEntry(event, id)
  const previous = JSON.parse(existing.content ?? '{}')
  const post = { ...previous, ...body, id: undefined }
  const title = typeof post.title === 'string' && post.title.trim() ? post.title.trim() : 'Forum post'

  setHeader(event, 'Cache-Control', 'private, no-store')

  await $fetch(`${config.public.strapiUrl}/api/entradas/${id}`, {
    method: 'PUT',
    headers: strapiAuthHeaders(event),
    body: {
      data: {
        title: `${FORUM_ENTRY_MARKER} ${title}`.slice(0, 255),
        content: JSON.stringify(post),
        excerpt: FORUM_ENTRY_MARKER,
        acceso: 'suscriptores',
      },
    },
  })

  return { ...post, id }
})
