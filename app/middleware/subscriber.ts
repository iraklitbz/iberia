export default defineNuxtRouteMiddleware(async () => {
  const { isSubscriber, authReady, token, fetchUser } = useAuth()
  const localePath = useLocalePath()
  if (!authReady.value && token.value) {
    await fetchUser()
    authReady.value = true
  }
  if (!authReady.value) return
  if (!isSubscriber.value) return navigateTo(localePath('/account'))
})
