export default defineNuxtRouteMiddleware(() => {
  const { isSubscriber, authReady } = useAuth()
  if (!authReady.value) return
  if (!isSubscriber.value) return navigateTo('/cuenta')
})
