interface StrapiEntry {
  documentId: string
  content?: string | null
}

export default defineEventHandler(async (event) => {
  const user = await requireForumSubscriber(event)

  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, message: 'Missing post id' })
  }

  const config = useRuntimeConfig(event)
  const existing = await $fetch<{ data: StrapiEntry }>(
    `${config.public.strapiUrl}/api/entradas/${id}`,
    {
      headers: strapiAuthHeaders(event),
    },
  )

  const post = JSON.parse(existing.data.content ?? '{}')
  const canDelete = post.authorKey === forumUserKey(user) || user.email === 'geo.algabe@gmail.com'

  if (!canDelete) {
    throw createError({ statusCode: 403, message: 'You cannot delete this post' })
  }

  setHeader(event, 'Cache-Control', 'private, no-store')

  await $fetch(`${config.public.strapiUrl}/api/entradas/${id}`, {
    method: 'DELETE',
    headers: strapiAuthHeaders(event),
  })

  return { ok: true }
})
