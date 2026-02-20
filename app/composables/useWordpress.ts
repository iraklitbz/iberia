import type { Post, PostsConnection, Category, GeoCategory } from '~/types/wordpress'
import { useGQL } from '~/composables/useGraphQL'

// ─── Queries ────────────────────────────────────────────────────────────────

const QUERY_HOME_POSTS = `
  query HomeQuery {
    posts(where: { categoryName: "home" }) {
      edges {
        node {
          id
          slug
          title
          content
          excerpt
          featuredImage {
            node { sourceUrl }
          }
        }
      }
    }
    geocategories(where: { name: "home" }) {
      edges {
        node {
          id
          news {
            edges {
              node {
                id
                slug
                title
                content
                excerpt
                featuredImage {
                  node { sourceUrl }
                }
              }
            }
          }
        }
      }
    }
  }
`

const QUERY_POSTS_BY_CATEGORY = `
  query PostsByCategory($first: Int, $slug: String!, $after: String) {
    posts(first: $first, after: $after, where: { categoryName: $slug }) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          id
          slug
          title
          excerpt
          date
          featuredImage {
            node { sourceUrl }
          }
        }
      }
    }
  }
`

const QUERY_GEO_POSTS_BY_CATEGORY = `
  query GeoPostsByCategory($first: Int, $slug: String!, $after: String) {
    geocategories(where: { search: $slug }) {
      edges {
        node {
          id
          news(first: $first, after: $after, where: { orderby: { field: DATE, order: DESC } }) {
            pageInfo {
              hasNextPage
              endCursor
            }
            edges {
              node {
                id
                slug
                title
                excerpt
                date
                featuredImage {
                  node { sourceUrl }
                }
              }
            }
          }
        }
      }
    }
  }
`

const QUERY_POST_BY_SLUG = `
  query PostBySlug($slug: ID!) {
    post(id: $slug, idType: URI) {
      id
      slug
      title
      content
      excerpt
      date
      featuredImage {
        node { sourceUrl }
      }
    }
  }
`

const QUERY_GEO_POST_BY_SLUG = `
  query GeoPostBySlug($slug: ID!) {
    geonew(id: $slug, idType: URI) {
      id
      slug
      title
      content
      excerpt
      date
      featuredImage {
        node { sourceUrl }
      }
    }
  }
`

const QUERY_ALL_CATEGORIES = `
  query AllCategories {
    categories {
      nodes {
        slug
        name
      }
    }
  }
`

const QUERY_ALL_POST_SLUGS = `
  query AllPostSlugs {
    posts {
      nodes { slug }
    }
  }
`

// ─── Composable functions ────────────────────────────────────────────────────

/**
 * Posts para el homepage según el idioma actual.
 */
export async function getHomePosts(locale: string): Promise<Post[]> {
  const data = await useGQL<{
    posts: { edges: { node: Post }[] }
    geocategories: { edges: { node: GeoCategory }[] }
  }>(QUERY_HOME_POSTS)

  if (locale === 'es') {
    return data.posts.edges.map(({ node }) => node)
  }

  const geoCategories = data.geocategories.edges.map(({ node }) => node)
  if (!geoCategories.length) return []
  return geoCategories[0].news.edges.map(({ node }) => node)
}

/**
 * Posts paginados por categoría (ES).
 */
export async function getPostsByCategory(
  slug: string,
  first = 9,
  after?: string,
): Promise<PostsConnection> {
  const data = await useGQL<{ posts: PostsConnection }>(QUERY_POSTS_BY_CATEGORY, {
    first,
    slug,
    after: after ?? null,
  })
  return data.posts
}

/**
 * Posts paginados por geocategoría (GE).
 */
export async function getGeoPostsByCategory(
  slug: string,
  first = 9,
  after?: string,
): Promise<PostsConnection | null> {
  const data = await useGQL<{
    geocategories: { edges: { node: { news: PostsConnection } }[] }
  }>(QUERY_GEO_POSTS_BY_CATEGORY, { first, slug, after: after ?? null })

  const categories = data.geocategories.edges
  if (!categories.length) return null
  return categories[0].node.news
}

/**
 * Post individual por slug (ES).
 */
export async function getPostBySlug(slug: string): Promise<Post | null> {
  const data = await useGQL<{ post: Post | null }>(QUERY_POST_BY_SLUG, { slug })
  return data.post
}

/**
 * Geo-post individual por slug (GE).
 */
export async function getGeoPostBySlug(slug: string): Promise<Post | null> {
  const data = await useGQL<{ geonew: Post | null }>(QUERY_GEO_POST_BY_SLUG, { slug })
  return data.geonew
}

/**
 * Todas las categorías (para generar rutas estáticas).
 */
export async function getAllCategories(): Promise<Category[]> {
  const data = await useGQL<{ categories: { nodes: Category[] } }>(QUERY_ALL_CATEGORIES)
  return data.categories.nodes
}

/**
 * Todos los slugs de posts (para generar rutas estáticas).
 */
export async function getAllPostSlugs(): Promise<string[]> {
  const data = await useGQL<{ posts: { nodes: { slug: string }[] } }>(QUERY_ALL_POST_SLUGS)
  return data.posts.nodes.map(n => n.slug)
}
