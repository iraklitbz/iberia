export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const pathParam = getRouterParam(event, 'path') ?? ''
  const rawSearch = getRequestURL(event).search  // preserva los brackets tal cual: ?filters[category][slug][$eq]=news&...
  const strapiPath = pathParam + rawSearch

  const auth = getHeader(event, 'authorization') ?? `Bearer ${config.public.strapiToken}`
  const isAuthenticated = getHeader(event, 'x-authenticated') === '1'

  // Clave de caché: usuarios logueados tienen su propio bucket para no mezclar contenidos
  const bucket = isAuthenticated ? 'auth' : 'public'
  const cacheKey = `strapi:${bucket}:${strapiPath}`

  const storage = useStorage('cache')
  const cached = await storage.getItem(cacheKey)

  if (cached) {
    setHeader(event, 'x-cache', 'HIT')
    return cached
  }

  const data = await $fetch(`${config.public.strapiUrl}/api/${strapiPath}`, {
    headers: { Authorization: auth },
  })

  // Público: 24h (el webhook lo invalida ante cambios)
  // Autenticado: 2 min (contenido personalizado por rol, preferimos frescura)
  const ttl = isAuthenticated ? 120 : 60 * 60 * 24
  await storage.setItem(cacheKey, data, { ttl })

  setHeader(event, 'x-cache', 'MISS')
  return data
})
