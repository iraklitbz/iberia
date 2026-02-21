export default defineNuxtPlugin(async () => {
  const { token, fetchUser, authReady } = useAuth()
  if (token.value) {
    await fetchUser()
  }
  authReady.value = true
})
