export default defineEventHandler(async (event) => {
  await requireForumSubscriber(event)

  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, message: 'Missing post id' })
  }

  const body = await readBody<Record<string, unknown>>(event)
  const existing = await getForumEntry(event, id)
  const previous = forumPostFromEntry(existing)
  const post = { ...previous, ...body, id: undefined }
  const title = typeof post.title === 'string' && post.title.trim() ? post.title.trim() : 'Forum post'

  setHeader(event, 'Cache-Control', 'private, no-store')

  await updateForumEntry(event, id, existing.collection, title, post)

  return { ...post, id }
})
