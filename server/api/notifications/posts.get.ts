type StrapiMedia = {
  url?: string
  attributes?: {
    url?: string
  }
}

type StrapiPost = {
  id?: number
  documentId?: string
  slug?: string
  title?: string
  excerpt?: string | null
  publishedAt?: string | null
  createdAt?: string | null
  updatedAt?: string | null
  cover?: StrapiMedia | { data?: StrapiMedia | null } | null
  attributes?: {
    slug?: string
    title?: string
    excerpt?: string | null
    publishedAt?: string | null
    createdAt?: string | null
    updatedAt?: string | null
    cover?: StrapiMedia | { data?: StrapiMedia | null } | null
  }
}

type StrapiResponse<T> = {
  data?: T
}

type NotificationPost = {
  id: string
  slug: string
  title: string
  excerpt: string
  date: string
  image: string | null
  localeCode: 'es' | 'ge'
}

const FORUM_ENTRY_MARKER = '__FORUM_POST__'

export default defineEventHandler(async (event) => {
  setHeader(event, 'Cache-Control', 'private, no-store')

  const config = useRuntimeConfig(event)
  const [spanishPosts, georgianPosts] = await Promise.all([
    fetchCollection(config, 'entradas', 'es'),
    fetchCollection(config, 'georgians', 'ge'),
  ])

  return [...spanishPosts, ...georgianPosts]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 40)
})

async function fetchCollection(
  config: ReturnType<typeof useRuntimeConfig>,
  collection: 'entradas' | 'georgians',
  localeCode: 'es' | 'ge',
): Promise<NotificationPost[]> {
  try {
    const response = await $fetch<StrapiResponse<StrapiPost[]>>(
      `${config.public.strapiUrl}/api/${collection}?populate=cover&pagination[page]=1&pagination[pageSize]=40&sort[0]=publishedAt:desc&sort[1]=createdAt:desc`,
      {
        headers: { Authorization: `Bearer ${config.strapiToken}` },
      },
    )

    return (response.data ?? [])
      .map(post => normalizePost(post, localeCode))
      .filter((post): post is NotificationPost => Boolean(post))
  }
  catch {
    return []
  }
}

function normalizePost(post: StrapiPost, localeCode: 'es' | 'ge'): NotificationPost | null {
  const source = post.attributes ?? post
  const slug = source.slug
  const title = source.title
  const excerpt = source.excerpt ?? ''
  const date = source.publishedAt ?? source.createdAt ?? source.updatedAt

  if (!slug || !title || !date || excerpt === FORUM_ENTRY_MARKER) {
    return null
  }

  return {
    id: `${localeCode}:${post.documentId ?? post.id ?? slug}`,
    slug,
    title,
    excerpt,
    date,
    image: coverUrl(source.cover ?? null),
    localeCode,
  }
}

function coverUrl(cover: StrapiPost['cover']): string | null {
  if (!cover) {
    return null
  }

  const media = 'data' in cover ? cover.data : cover
  return media?.url ?? media?.attributes?.url ?? null
}
