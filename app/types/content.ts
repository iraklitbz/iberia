export interface FeaturedImage {
  node: {
    sourceUrl: string
  }
}

export interface Post {
  id: string
  slug: string
  title: string
  content: string
  excerpt: string
  date: string
  featuredImage: FeaturedImage | null
}

export interface PostEdge {
  node: Post
}

export interface PageInfo {
  hasNextPage: boolean
  endCursor: string | null
}

export interface PostsConnection {
  pageInfo: PageInfo
  edges: PostEdge[]
}

export interface Category {
  slug: string
  name: string
}

export interface GeoCategory {
  id: string
  news: {
    edges: PostEdge[]
  }
}
