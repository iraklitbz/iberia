interface User {
  id: number
  documentId: string
  username: string
  email: string
  confirmed: boolean
  blocked: boolean
}

interface AuthResponse {
  jwt: string
  user: User
}

export function useAuth() {
  const config = useRuntimeConfig()
  const baseUrl = config.public.strapiUrl

  const token = useCookie<string | null>('auth_token', {
    maxAge: 60 * 60 * 24 * 30, // 30 days
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  })

  const user = useState<User | null>('auth_user', () => null)

  const isAuthenticated = computed(() => !!token.value && !!user.value)

  async function login(email: string, password: string): Promise<void> {
    const data = await $fetch<AuthResponse>(`${baseUrl}/api/auth/local`, {
      method: 'POST',
      body: { identifier: email, password },
    })
    token.value = data.jwt
    user.value = data.user
  }

  async function register(username: string, email: string, password: string): Promise<void> {
    await $fetch<AuthResponse>(`${baseUrl}/api/auth/local/register`, {
      method: 'POST',
      body: { username, email, password },
    })
    // Don't auto-login after register — email confirmation required
  }

  function logout(): void {
    token.value = null
    user.value = null
  }

  async function fetchUser(): Promise<void> {
    if (!token.value) return
    try {
      const data = await $fetch<User>(`${baseUrl}/api/users/me`, {
        headers: { Authorization: `Bearer ${token.value}` },
      })
      user.value = data
    }
    catch {
      // Token invalid or expired — clear it
      token.value = null
      user.value = null
    }
  }

  async function forgotPassword(email: string): Promise<void> {
    await $fetch(`${baseUrl}/api/auth/forgot-password`, {
      method: 'POST',
      body: { email },
    })
  }

  async function resetPassword(
    code: string,
    password: string,
    passwordConfirmation: string,
  ): Promise<void> {
    const data = await $fetch<AuthResponse>(`${baseUrl}/api/auth/reset-password`, {
      method: 'POST',
      body: { code, password, passwordConfirmation },
    })
    token.value = data.jwt
    user.value = data.user
  }

  async function confirmEmail(confirmation: string): Promise<void> {
    const data = await $fetch<AuthResponse>(
      `${baseUrl}/api/auth/email-confirmation?confirmation=${confirmation}`,
    )
    token.value = data.jwt
    user.value = data.user
  }

  async function resendConfirmation(email: string): Promise<void> {
    await $fetch(`${baseUrl}/api/auth/send-email-confirmation`, {
      method: 'POST',
      body: { email },
    })
  }

  async function loginWithToken(jwt: string): Promise<void> {
    try {
      const data = await $fetch<User>(`${baseUrl}/api/users/me`, {
        headers: { Authorization: `Bearer ${jwt}` },
      })
      token.value = jwt
      user.value = data
    }
    catch (err) {
      token.value = null
      user.value = null
      throw err
    }
  }

  function connectWithProvider(provider: 'google' | 'facebook') {
    window.location.href = `${baseUrl}/api/connect/${provider}`
  }

  return {
    user: readonly(user),
    token: readonly(token),
    isAuthenticated,
    login,
    register,
    logout,
    fetchUser,
    forgotPassword,
    resetPassword,
    confirmEmail,
    resendConfirmation,
    loginWithToken,
    connectWithProvider,
  }
}
