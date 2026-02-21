import type { Post, PostsConnection, Category } from '~/types/content'

// ─── Tipos internos de Strapi ────────────────────────────────────────────────

interface StrapiCover {
  url: string
}

interface StrapiPost {
  id: number
  documentId: string
  slug: string
  title: string
  content: string | null
  excerpt: string | null
  publishedAt: string | null
  cover: StrapiCover | null
}

interface StrapiMeta {
  pagination: {
    page: number
    pageSize: number
    pageCount: number
    total: number
  }
}

interface StrapiResponse<T> {
  data: T
  meta: StrapiMeta
}

// ─── Cliente Strapi ──────────────────────────────────────────────────────────

async function strapiGet<T>(path: string): Promise<StrapiResponse<T>> {
  const config = useRuntimeConfig()
  return $fetch<StrapiResponse<T>>(`${config.public.strapiUrl}/api/${path}`, {
    headers: {
      Authorization: `Bearer ${config.public.strapiToken}`,
    },
  })
}

// ─── Mapear Strapi → interfaz Post (compatible con el resto de la app) ───────

function mapPost(item: StrapiPost): Post {
  return {
    id: item.documentId,
    slug: item.slug,
    title: item.title,
    content: item.content ?? '',
    excerpt: item.excerpt ?? '',
    date: item.publishedAt ?? '',
    // Mapeamos cover de Strapi/Cloudinary al formato que usan los templates
    featuredImage: item.cover?.url
      ? { node: { sourceUrl: item.cover.url } }
      : null,
  }
}

// ─── Funciones públicas ──────────────────────────────────────────────────────

/**
 * Posts para el homepage según el idioma actual.
 */
export async function getHomePosts(locale: string): Promise<Post[]> {
  const endpoint = locale === 'es' ? 'entradas' : 'georgians'
  const res = await strapiGet<StrapiPost[]>(
    `${endpoint}?filters[category][slug][$eq]=home&populate=cover&pagination[pageSize]=3&sort=publishedAt:desc`,
  )
  return (res.data ?? []).map(mapPost)
}

/**
 * Posts paginados por categoría (ES).
 * Usa paginación por página en vez de cursores; endCursor = número de página siguiente.
 */
export async function getPostsByCategory(
  slug: string,
  first = 9,
  after?: string,
): Promise<PostsConnection> {
  const page = after ? parseInt(after, 10) : 1
  const res = await strapiGet<StrapiPost[]>(
    `entradas?filters[category][slug][$eq]=${slug}&populate=cover&pagination[page]=${page}&pagination[pageSize]=${first}&sort=publishedAt:desc`,
  )
  const p = res.meta.pagination
  return {
    pageInfo: {
      hasNextPage: p.page < p.pageCount,
      endCursor: p.page < p.pageCount ? String(p.page + 1) : null,
    },
    edges: (res.data ?? []).map(item => ({ node: mapPost(item) })),
  }
}

/**
 * Posts paginados por geocategoría (GE).
 */
export async function getGeoPostsByCategory(
  slug: string,
  first = 9,
  after?: string,
): Promise<PostsConnection> {
  const page = after ? parseInt(after, 10) : 1
  const res = await strapiGet<StrapiPost[]>(
    `georgians?filters[category][slug][$eq]=${slug}&populate=cover&pagination[page]=${page}&pagination[pageSize]=${first}&sort=publishedAt:desc`,
  )
  const p = res.meta.pagination
  return {
    pageInfo: {
      hasNextPage: p.page < p.pageCount,
      endCursor: p.page < p.pageCount ? String(p.page + 1) : null,
    },
    edges: (res.data ?? []).map(item => ({ node: mapPost(item) })),
  }
}

/**
 * Post individual por slug (ES).
 */
export async function getPostBySlug(slug: string): Promise<Post | null> {
  const res = await strapiGet<StrapiPost[]>(
    `entradas?filters[slug][$eq]=${slug}&populate=cover`,
  )
  const items = res.data ?? []
  return items.length ? mapPost(items[0]) : null
}

/**
 * Geo-post individual por slug (GE).
 */
export async function getGeoPostBySlug(slug: string): Promise<Post | null> {
  const res = await strapiGet<StrapiPost[]>(
    `georgians?filters[slug][$eq]=${slug}&populate=cover`,
  )
  const items = res.data ?? []
  return items.length ? mapPost(items[0]) : null
}

/**
 * Todas las categorías (para generar rutas estáticas).
 */
export async function getAllCategories(): Promise<Category[]> {
  const [esRes, geRes] = await Promise.all([
    strapiGet<Category[]>('entrada-categories?fields[0]=name&fields[1]=slug&pagination[pageSize]=100'),
    strapiGet<Category[]>('georgian-categories?fields[0]=name&fields[1]=slug&pagination[pageSize]=100'),
  ])
  const all = [...(esRes.data ?? []), ...(geRes.data ?? [])]
  const seen = new Set<string>()
  return all.filter(c => {
    if (seen.has(c.slug)) return false
    seen.add(c.slug)
    return true
  })
}

/**
 * Todos los slugs de posts (para generar rutas estáticas).
 */
export async function getAllPostSlugs(): Promise<string[]> {
  const [esRes, geRes] = await Promise.all([
    strapiGet<{ slug: string }[]>('entradas?fields[0]=slug&pagination[pageSize]=1000'),
    strapiGet<{ slug: string }[]>('georgians?fields[0]=slug&pagination[pageSize]=1000'),
  ])
  return [
    ...(esRes.data ?? []).map(p => p.slug),
    ...(geRes.data ?? []).map(p => p.slug),
  ]
}
