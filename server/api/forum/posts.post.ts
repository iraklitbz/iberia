export default defineEventHandler(async (event) => {
  const user = await requireForumSubscriber(event)
  const body = await readBody<Record<string, unknown>>(event)
  const createdAt = typeof body.createdAt === 'string' ? body.createdAt : new Date().toISOString()
  const title = typeof body.title === 'string' && body.title.trim() ? body.title.trim() : 'Forum post'

  setHeader(event, 'Cache-Control', 'private, no-store')

  const post = {
    ...body,
    id: undefined,
    authorKey: body.authorKey ?? forumUserKey(user),
    createdAt,
  }

  const response = await createForumEntry(event, title, post)

  return { ...post, id: response.documentId, createdAt: post.createdAt ?? response.createdAt }
})
