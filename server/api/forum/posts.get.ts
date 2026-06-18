interface StrapiEntry {
  documentId: string
  content?: string | null
  createdAt?: string
}

interface StrapiListResponse {
  data: StrapiEntry[]
}

export default defineEventHandler(async (event) => {
  await requireForumSubscriber(event)

  setHeader(event, 'Cache-Control', 'private, no-store')

  const config = useRuntimeConfig(event)
  const response = await $fetch<StrapiListResponse>(
    `${config.public.strapiUrl}/api/entradas?filters[excerpt][$eq]=${FORUM_ENTRY_MARKER}&pagination[pageSize]=100&sort=createdAt:desc`,
    {
      headers: strapiAuthHeaders(event),
    },
  )

  return (response.data ?? []).flatMap((entry) => {
    try {
      const post = JSON.parse(entry.content ?? '{}')
      return [{ ...post, id: entry.documentId, createdAt: post.createdAt ?? entry.createdAt }]
    }
    catch {
      return []
    }
  })
})
