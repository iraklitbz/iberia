# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## Cloudflare cache + invalidation webhook

This app exposes Strapi data through `GET /api/strapi/*`.

- Public requests are cacheable in CDN:
  - `Cache-Control: public, max-age=0, s-maxage=600, stale-while-revalidate=86400`
- Authenticated requests (`Authorization` header) are never cached:
  - `Cache-Control: private, no-store`

To purge Cloudflare cache from Strapi webhook:

1. Configure env vars:
   - `REVALIDATE_SECRET`
   - `CLOUDFLARE_API_TOKEN`
   - `CLOUDFLARE_ZONE_ID`
   - `CLOUDFLARE_PURGE_PATHS` (default `/*`)
   - `CLOUDFLARE_PURGE_EVERYTHING` (`false` by default)
2. Create a Strapi webhook:
   - URL: `https://your-domain.com/api/revalidate`
   - Method: `POST`
   - Header: `x-webhook-secret: <REVALIDATE_SECRET>`
   - Body option A (paths):
     ```json
     { "paths": ["/news/*", "/category/*"] }
     ```
   - Body option B (explicit URLs):
     ```json
     { "urls": ["https://your-domain.com/news/foo"] }
     ```

If body is omitted, the server uses `CLOUDFLARE_PURGE_PATHS` (built against `NUXT_PUBLIC_SITE_URL`).
If any `paths` entry contains `*`, the endpoint uses `purge_everything` in Cloudflare.
