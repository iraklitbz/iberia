export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const pathParam = getRouterParam(event, 'path') ?? ''
  const rawSearch = getRequestURL(event).search
  const strapiPath = pathParam + rawSearch

  const auth = getHeader(event, 'authorization') ?? `Bearer ${config.public.strapiToken}`

  return $fetch(`${config.public.strapiUrl}/api/${strapiPath}`, {
    headers: { Authorization: auth },
  })
})
