export default defineEventHandler(async (event) => {
  const user = await requireForumUser(event)

  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, message: 'Missing post id' })
  }

  const body = await readBody<Record<string, unknown>>(event)
  const existing = await getForumEntry(event, id)
  const previous = forumPostFromEntry(event, existing)
  const post = preserveExistingDocuments(
    { ...previous, ...body, id: undefined },
    forumDocumentItemsFromEntry(existing),
  )
  const title = typeof post.title === 'string' ? post.title.trim() : ''
  const removedComments = removedForumComments(previous.commentItems, post.commentItems)

  if (
    removedComments.length
    && user.email !== 'geo.algabe@gmail.com'
    && removedComments.some(comment => !ownsForumComment(comment, user))
  ) {
    throw createError({ statusCode: 403, message: 'You cannot delete this comment' })
  }

  setHeader(event, 'Cache-Control', 'private, no-store')

  await updateForumEntry(event, id, existing.collection, title, post)

  return { ...post, id }
})

function preserveExistingDocuments(
  post: Record<string, unknown>,
  existingDocuments: Array<Record<string, unknown>>,
) {
  if (!Array.isArray(post.media) || !existingDocuments.length) {
    return post
  }

  const media = post.media.map((item) => {
    if (!item || typeof item !== 'object') {
      return item
    }

    const mediaItem = item as Record<string, unknown>
    const src = typeof mediaItem.src === 'string' ? mediaItem.src : ''

    if (mediaItem.type !== 'document' || !isForumDocumentRoute(src)) {
      return item
    }

    const existing = findExistingDocument(mediaItem, existingDocuments)
    if (!existing || typeof existing.src !== 'string' || isForumDocumentRoute(existing.src)) {
      return item
    }

    return {
      ...mediaItem,
      src: existing.src,
    }
  })

  return {
    ...post,
    media,
  }
}

function isForumDocumentRoute(src: string) {
  return src.includes('/api/forum/documents/')
}

function findExistingDocument(
  mediaItem: Record<string, unknown>,
  existingDocuments: Array<Record<string, unknown>>,
) {
  const mediaId = String(mediaItem.id ?? '')
  const mediaName = typeof mediaItem.name === 'string' ? mediaItem.name : ''

  return existingDocuments.find((document) => {
    return String(document.id ?? '') === mediaId
      || (mediaName && document.name === mediaName)
  })
}

function removedForumComments(previous: unknown, next: unknown): Array<Record<string, unknown>> {
  if (!Array.isArray(previous) || !Array.isArray(next)) {
    return []
  }

  const nextIds = new Set(next.map(comment => String(comment?.id ?? '')))
  return previous.filter(comment => !nextIds.has(String(comment?.id ?? '')))
}

function ownsForumComment(comment: Record<string, unknown>, user: ForumUser) {
  return comment.authorKey === forumUserKey(user) || ownsLegacyForumItem(comment.name, user)
}

function ownsLegacyForumItem(name: unknown, user: ForumUser) {
  if (typeof name !== 'string') {
    return false
  }

  const normalizedName = name.trim().toLowerCase()
  const emailName = user.email.split('@')[0]?.trim().toLowerCase()
  const username = user.username?.trim().toLowerCase()

  return normalizedName === username || normalizedName === emailName
}
