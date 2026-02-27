type RevalidateBody = {
  paths?: string[]
  urls?: string[]
}

function toPathList(input: unknown): string[] {
  if (!Array.isArray(input)) return []
  return input
    .filter((item: unknown) => typeof item === 'string')
    .map((path: string) => path.trim())
    .filter(Boolean)
    .map((path: string) => (path.startsWith('/') ? path : `/${path}`))
}

function toUrlList(input: unknown): string[] {
  if (!Array.isArray(input)) return []
  return input
    .filter((item: unknown) => typeof item === 'string')
    .map((url: string) => url.trim())
    .filter(Boolean)
}

function parseCsvPaths(rawPaths: string): string[] {
  return rawPaths
    .split(',')
    .map((path: string) => path.trim())
    .filter(Boolean)
    .map((path: string) => (path.startsWith('/') ? path : `/${path}`))
}

function toAbsoluteUrl(baseUrl: string, path: string): string {
  const cleanBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl
  return `${cleanBase}${path}`
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const headerSecret = getHeader(event, 'x-webhook-secret')
  const authHeader = getHeader(event, 'authorization')
  const bearerSecret = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null
  const body = await readBody<RevalidateBody>(event)

  if (!config.revalidateSecret) {
    throw createError({ statusCode: 500, statusMessage: 'REVALIDATE_SECRET is not configured' })
  }

  if (headerSecret !== config.revalidateSecret && bearerSecret !== config.revalidateSecret) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid webhook secret' })
  }

  if (!config.cloudflareApiToken || !config.cloudflareZoneId) {
    throw createError({
      statusCode: 500,
      statusMessage: 'CLOUDFLARE_API_TOKEN and CLOUDFLARE_ZONE_ID are required',
    })
  }

  const siteUrl = config.public.siteUrl
  const payloadPaths = toPathList(body?.paths)
  const payloadUrls = toUrlList(body?.urls)
  const envPaths = parseCsvPaths(config.cloudflarePurgePaths)
  const paths = payloadPaths.length > 0 ? payloadPaths : envPaths
  const urls = payloadUrls.length > 0 ? payloadUrls : paths.map(path => toAbsoluteUrl(siteUrl, path))
  const hasWildcardPaths = payloadUrls.length === 0 && paths.some(path => path.includes('*'))

  const purgeEverything = hasWildcardPaths || (config.cloudflarePurgeEverything && payloadPaths.length === 0 && payloadUrls.length === 0)
  const payload = purgeEverything ? { purge_everything: true } : { files: urls }

  const result = await $fetch<{ success: boolean, errors?: unknown[] }>(
    `https://api.cloudflare.com/client/v4/zones/${config.cloudflareZoneId}/purge_cache`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.cloudflareApiToken}`,
        'Content-Type': 'application/json',
      },
      body: payload,
    },
  )

  if (!result.success) {
    throw createError({
      statusCode: 502,
      statusMessage: 'Cloudflare purge failed',
      data: result.errors ?? [],
    })
  }

  return {
    ok: true,
    purgeEverything,
    urls: purgeEverything ? ['*'] : urls,
  }
})
