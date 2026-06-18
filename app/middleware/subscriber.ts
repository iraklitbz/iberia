export default defineNuxtRouteMiddleware(async () => {
  const { isSubscriber, authReady, token, fetchUser } = useAuth()
  const localePath = useLocalePath()
  if (!authReady.value && token.value) {
    await fetchUser()
    authReady.value = true
  }
  if (!authReady.value) return
  if (isSubscriber.value) return

  try {
    const subscriber = await $fetch<{ isSubscriber: boolean }>('/api/auth/subscriber', {
      headers: { Authorization: `Bearer ${token.value}` },
    })
    if (subscriber.isSubscriber) return
  }
  catch {
    // Keep the forum closed if the role cannot be verified.
  }

  return navigateTo(localePath('/account'))
})
