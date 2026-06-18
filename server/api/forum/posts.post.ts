export default defineEventHandler(async (event) => {
  const user = await requireForumSubscriber(event)
  const body = await readBody<Record<string, unknown>>(event)
  const createdAt = typeof body.createdAt === 'string' ? body.createdAt : new Date().toISOString()
  const title = typeof body.title === 'string' && body.title.trim() ? body.title.trim() : 'Forum post'

  setHeader(event, 'Cache-Control', 'private, no-store')

  const config = useRuntimeConfig(event)
  const post = {
    ...body,
    id: undefined,
    authorKey: body.authorKey ?? forumUserKey(user),
    createdAt,
  }

  const response = await $fetch<{ data: { documentId: string, createdAt?: string } }>(
    `${config.public.strapiUrl}/api/entradas`,
    {
      method: 'POST',
      headers: strapiAuthHeaders(event),
      body: {
        data: {
          title: `${FORUM_ENTRY_MARKER} ${title}`.slice(0, 255),
          content: JSON.stringify(post),
          excerpt: FORUM_ENTRY_MARKER,
          acceso: 'suscriptores',
          publishedAt: new Date().toISOString(),
        },
      },
    },
  )

  return { ...post, id: response.data.documentId, createdAt: post.createdAt ?? response.data.createdAt }
})
