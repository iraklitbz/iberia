/**
 * Cliente GraphQL ligero basado en $fetch de Nuxt.
 * Reemplaza @nuxtjs/apollo que no es compatible con Nuxt 4.
 * Endpoint: https://iberiainfo.me/graphql (WordPress público, sin auth)
 */

const GQL_ENDPOINT = 'https://iberiainfo.me/graphql'

export async function useGQL<T = unknown>(
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> {
  const data = await $fetch<{ data: T; errors?: { message: string }[] }>(GQL_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: { query, variables },
  })

  if (data.errors?.length) {
    throw new Error(data.errors.map(e => e.message).join(', '))
  }

  return data.data
}
