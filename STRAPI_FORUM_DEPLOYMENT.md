# Strapi Forum Deployment

Current date: 2026-07-01

The Nuxt app is ready for a clean forum migration, but the live Strapi server is running in production mode.

Strapi returned:

```text
Content-Type Builder modifications are disabled in production mode.
Schema changes can only be made when running with autoReload enabled (strapi develop).
```

That means forum content types must be added through the Strapi backend source code and deployed, or created in a development Strapi instance running with:

```text
strapi develop
```

## Strapi API Files Prepared

The complete API files are prepared here:

```text
strapi/forum-content-types/forum-category
strapi/forum-content-types/forum-post
strapi/forum-content-types/forum-comment
strapi/forum-content-types/forum-like
```

They are also packaged as:

```text
tmp/strapi-forum-content-types.zip
```

Install them into a local Strapi backend with:

```bash
npm run forum:schema:install -- C:\path\to\strapi-backend
```

This creates the expected Strapi structure:

```text
src/api/forum-category/content-types/forum-category/schema.json
src/api/forum-category/controllers/forum-category.js
src/api/forum-category/routes/forum-category.js
src/api/forum-category/services/forum-category.js

src/api/forum-post/content-types/forum-post/schema.json
src/api/forum-post/controllers/forum-post.js
src/api/forum-post/routes/forum-post.js
src/api/forum-post/services/forum-post.js

src/api/forum-comment/content-types/forum-comment/schema.json
src/api/forum-comment/controllers/forum-comment.js
src/api/forum-comment/routes/forum-comment.js
src/api/forum-comment/services/forum-comment.js

src/api/forum-like/content-types/forum-like/schema.json
src/api/forum-like/controllers/forum-like.js
src/api/forum-like/routes/forum-like.js
src/api/forum-like/services/forum-like.js
```

After deploying/restarting Strapi, these endpoints should exist:

```text
/api/forum-categories
/api/forum-posts
/api/forum-comments
/api/forum-likes
```

## Migration Commands

From the Nuxt app folder:

First export a local backup of the legacy `Entrada` forum records:

```bash
npm run forum:legacy:export
```

The backup is written under:

```text
tmp/legacy-forum-export-*.json
```

Rollback helper, dry-run by default:

```bash
npm run forum:legacy:restore -- tmp/legacy-forum-export-YYYY-MM-DD.json
```

Only use this with `--apply` if legacy `Entrada` records need to be recreated:

```bash
npm run forum:legacy:restore -- tmp/legacy-forum-export-YYYY-MM-DD.json --apply
```

Then verify the new Strapi endpoints:

```bash
npm run forum:migrate:dry
```

Expected before Strapi deployment:

```text
GET /api/forum-posts... failed: 404 Not Found
```

Expected after Strapi deployment:

```text
Legacy forum entries: 14
Already migrated: 0
Pending migration: 14
Dry run only. Re-run with --apply...
```

Then run:

```bash
npm run forum:migrate
```

The migration leaves legacy `Entrada` records untouched.

## Disable Legacy Fallback

After `npm run forum:verify` shows:

```text
Pending migration: 0
```

set this environment variable for the Nuxt app:

```text
FORUM_LEGACY_FALLBACK=false
```

Then rebuild/redeploy Nuxt. This makes `/api/forum/*` depend only on the dedicated forum content types.
