export default defineEventHandler(async (event) => {
  const user = await requireForumSubscriber(event)

  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, message: 'Missing post id' })
  }

  const existing = await getForumEntry(event, id)
  const post = forumPostFromEntry(existing)
  const canDelete = user.email === 'geo.algabe@gmail.com'
    || post.authorKey === forumUserKey(user)
    || ownsLegacyForumItem(post.name, user)

  if (!canDelete) {
    throw createError({ statusCode: 403, message: 'You cannot delete this post' })
  }

  setHeader(event, 'Cache-Control', 'private, no-store')

  await deleteForumEntry(event, id, existing.collection)

  return { ok: true }
})

function ownsLegacyForumItem(name: unknown, user: ForumUser) {
  if (typeof name !== 'string') {
    return false
  }

  const normalizedName = name.trim().toLowerCase()
  const emailName = user.email.split('@')[0]?.trim().toLowerCase()
  const username = user.username?.trim().toLowerCase()

  return normalizedName === username || normalizedName === emailName
}
