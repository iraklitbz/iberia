# Forum Migration Audit

Current date: 2026-07-01

## Current Storage

The forum page does not read from a dedicated Strapi forum collection today.

Frontend route:

- `app/pages/forum.vue`

Nuxt API route:

- `server/api/forum/posts.get.ts`
- `server/api/forum/posts.post.ts`
- `server/api/forum/posts/[id].patch.ts`
- `server/api/forum/posts/[id].delete.ts`

Storage helper:

- `server/utils/forum.ts`

The helper first tries Strapi collection `foromis`, but the live Strapi API returns `404`.
It then falls back to Strapi collection `entradas`.

Legacy forum entries are filtered by:

```text
excerpt = __FORUM_POST__
```

The actual forum post object is stored as JSON in:

```text
Entrada.content
```

Live audit result:

- Legacy forum records found: `14`
- Nested media items found: `1`
- Nested comments found: `4`
- Nested liked-by entries found: `2`

## Current Legacy Post Shape

Fields currently stored inside `Entrada.content`:

```ts
type LegacyForumPost = {
  name: string
  initial: string
  authorKey: string
  title: string
  message: string
  media: LegacyForumMedia[]
  comments: number
  commentItems: LegacyForumComment[]
  likes: number
  likedBy: string[]
  createdAt: string
  avatarClass: string
  avatarUrl: string
}
```

Media shape:

```ts
type LegacyForumMedia = {
  id: number
  type: 'image' | 'video'
  src: string
  name: string
}
```

Comment shape:

```ts
type LegacyForumComment = {
  id: string
  name: string
  initial: string
  authorKey: string
  message: string
  createdAt: string
  avatarClass: string
  avatarUrl: string
}
```

Likes are currently stored as:

```ts
likedBy: string[]
likes: number
```

The `likedBy` values are user keys such as:

```text
user:<id>
```

## Frontend Behavior Depending On This Shape

The forum page expects these capabilities:

- List posts sorted by newest, popular, or comments.
- Search by post title, message, or category.
- Create a post with title, message, media, author display name, avatar, and author key.
- Upload image/video media through `/api/forum/media`.
- Like a post once per current user key.
- Add comments.
- Delete own comments.
- Delete own posts.
- Allow moderator email `geo.algabe@gmail.com` to delete any post/comment.
- Support legacy ownership fallback by comparing display name with username/email prefix.
- Persist comment seen state in browser local storage.

## Main Problems With Current Approach

- Forum content is mixed into the news/blog `Entrada` collection.
- Strapi admin users cannot clearly distinguish forum posts without knowing the marker.
- Comments are embedded inside post JSON, so they cannot be moderated, queried, filtered, or permissioned independently.
- Likes are embedded as a string array, so they are hard to validate and can race during concurrent updates.
- Media is stored as metadata inside JSON, not as a clear relation on a forum model.
- The code contains a dead primary collection attempt: `foromis`.
- Migration and future feature work are harder because the forum has no explicit schema.

## Migration Requirements

The new schema must preserve:

- Existing post titles and messages.
- Existing creation timestamps where possible.
- Existing author display fields and `authorKey` for ownership compatibility.
- Existing avatar URLs/classes for old posts.
- Existing uploaded media URLs and names.
- Existing comments and comment authors.
- Existing like counts and liked-by user keys.
- Existing Strapi document IDs in a legacy field so old references can be traced.

## Recommended Next Step

Design dedicated Strapi content types:

- `Forum Post`
- `Forum Comment`
- Optional `Forum Category`
- Optional `Forum Like` if likes need strict one-like-per-user enforcement at the database level.

