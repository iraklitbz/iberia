export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const secret = getHeader(event, 'x-revalidate-secret')

  if (!config.revalidateSecret || secret !== config.revalidateSecret) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const storage = useStorage('cache')
  const keys = await storage.getKeys('strapi:')
  await Promise.all(keys.map(k => storage.removeItem(k)))

  console.log(`[revalidate] Cache cleared: ${keys.length} entries (public + auth buckets)`)
  return { ok: true, cleared: keys.length }
})
