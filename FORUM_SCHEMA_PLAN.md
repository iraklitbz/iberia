# Forum Schema Plan

Current date: 2026-07-01

## Goal

Move the forum out of the legacy `Entrada` marker approach and into dedicated Strapi content types that are clear in the admin panel, easier to moderate, and safer to extend.

## Content Types

### Forum Category

Collection API ID:

```text
forum-category
forum-categories
```

Fields:

```text
name         string, required
slug         uid, targetField=name
description  text
order        integer
isActive     boolean
posts        oneToMany -> Forum Post.category
```

Purpose:

- Optional grouping for posts.
- Gives Strapi admins a clear place to manage forum sections later.

### Forum Post

Collection API ID:

```text
forum-post
forum-posts
```

Fields:

```text
title              string
message            text, required
media              media, multiple
category           manyToOne -> Forum Category.posts
comments           oneToMany -> Forum Comment.post
likes              oneToMany -> Forum Like.post
author             oneWay -> User
authorKey          string
authorName         string
authorInitial      string
avatarClass        string
avatarUrl          string
legacyDocumentId   string, unique
legacyCreatedAt    datetime
isPinned           boolean
isLocked           boolean
```

Purpose:

- Primary forum post model.
- Keeps legacy author display fields so old posts migrate cleanly.
- Uses Strapi media field for uploaded images/videos.
- Uses explicit relations for comments and likes.

### Forum Comment

Collection API ID:

```text
forum-comment
forum-comments
```

Fields:

```text
message            text, required
post               manyToOne -> Forum Post.comments
author             oneWay -> User
authorKey          string
authorName         string
authorInitial      string
avatarClass        string
avatarUrl          string
legacyCommentId    string
legacyCreatedAt    datetime
```

Purpose:

- Allows comments to be moderated independently in Strapi.
- Keeps legacy comment IDs and author fields for ownership compatibility.

### Forum Like

Collection API ID:

```text
forum-like
forum-likes
```

Fields:

```text
post       manyToOne -> Forum Post.likes
user       oneWay -> User
userKey    string, required
```

Purpose:

- Avoids storing likes as an embedded array.
- Makes it possible to enforce one like per user in application logic.

## API Compatibility

The frontend should continue talking to Nuxt routes:

```text
/api/forum/posts
/api/forum/posts/:id
/api/forum/media
```

The frontend should not call Strapi forum collections directly.

The Nuxt backend will translate Strapi forum records into the existing frontend shape:

```ts
type ForumPost = {
  id: string
  name: string
  initial: string
  authorKey?: string
  title: string
  message: string
  media?: ForumMedia[]
  category?: string
  comments: number
  commentItems: ForumComment[]
  likes: number
  likedBy: string[]
  createdAt: string
  avatarClass: string
  avatarUrl?: string
}
```

That keeps the page stable while the backend storage becomes professional.

## Migration Strategy

1. Read all `Entrada` records where `excerpt = __FORUM_POST__`.
2. Create one `Forum Post` per legacy entry.
3. Store the old `Entrada.documentId` in `Forum Post.legacyDocumentId`.
4. Convert legacy media URL metadata into the `media` field where the file already exists in Strapi uploads.
5. Create one `Forum Comment` per legacy `commentItems[]`.
6. Create one `Forum Like` per legacy `likedBy[]`.
7. Keep legacy `Entrada` records untouched until verification passes.

## Rollout Strategy

1. Create content types.
2. Migrate data.
3. Change Nuxt backend reads to prefer `forum-posts`.
4. Keep legacy `Entrada` fallback temporarily.
5. Verify production data.
6. Remove legacy fallback after confirmation.

