export default defineEventHandler(async (event) => {
  await requireForumSubscriber(event)

  setHeader(event, 'Cache-Control', 'private, no-store')

  const entries = await listForumEntries(event)

  return entries.flatMap((entry) => {
    try {
      const post = JSON.parse(entry.content ?? '{}')
      return [{ ...post, id: entry.documentId, createdAt: post.createdAt ?? entry.createdAt }]
    }
    catch {
      return []
    }
  })
})
