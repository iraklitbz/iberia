export default defineNuxtRouteMiddleware(() => {
  const { isSubscriber, authReady } = useAuth()
  const localePath = useLocalePath()
  if (!authReady.value) return
  if (!isSubscriber.value) return navigateTo(localePath('/account'))
})
