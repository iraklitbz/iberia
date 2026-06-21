export default defineEventHandler(async (event) => {
  setHeader(event, 'Cache-Control', 'private, no-store')

  const entries = await listForumEntries(event)

  return entries.flatMap((entry) => {
    try {
      const post = forumPostFromEntry(entry)
      return [{ ...post, id: entry.documentId, createdAt: post.createdAt ?? entry.createdAt }]
    }
    catch {
      return []
    }
  })
})
