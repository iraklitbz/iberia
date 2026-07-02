const LATIN_TO_GEORGIAN: Record<string, string> = {
  a: 'ა', b: 'ბ', c: 'ც', d: 'დ', e: 'ე',
  f: 'ფ', g: 'გ', h: 'ჰ', i: 'ი', j: 'ჯ',
  k: 'კ', l: 'ლ', m: 'მ', n: 'ნ', o: 'ო',
  p: 'პ', q: 'ყ', r: 'რ', s: 'ს', t: 'ტ',
  u: 'უ', v: 'ვ', w: 'ვ', x: 'ხ', y: 'ყ',
  z: 'ზ',
}

function toGeorgianInitial(name: string | undefined): string {
  if (!name) return '?'
  const char = name.charAt(0).toLowerCase()
  return LATIN_TO_GEORGIAN[char] ?? name.charAt(0).toUpperCase()
}

interface UserRole {
  id: number
  name: string
  type: string
}

interface User {
  id: number
  documentId: string
  username: string
  email: string
  profileAvatar?: string | null
  confirmed: boolean
  blocked: boolean
  role?: UserRole
}

interface AuthResponse {
  jwt: string
  user: User
}

interface SubscriberStatus {
  isSubscriber: boolean
  role: UserRole | null
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
  const authReady = useState<boolean>('auth_ready', () => false)
  const profileAvatar = useState<string | null>('auth_profile_avatar', () => null)

  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const userRole = computed(() => user.value?.role?.name ?? null)
  const isSubscriber = computed(() => user.value?.role?.name === 'Suscriptor' || user.value?.role?.type === 'suscriptor')
  const userInitial = computed(() => toGeorgianInitial(user.value?.username))

  async function login(email: string, password: string): Promise<void> {
    const data = await $fetch<AuthResponse>(`${baseUrl}/api/auth/local`, {
      method: 'POST',
      body: { identifier: email, password },
    })
    token.value = data.jwt
    user.value = data.user
    await fetchUser()
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
    profileAvatar.value = null
  }

  function setAuthenticatedUser(nextUser: User): void {
    user.value = nextUser
    profileAvatar.value = nextUser.profileAvatar ?? null
  }

  async function saveProfileAvatar(value: string | null, fileId?: number): Promise<void> {
    if (!token.value || !user.value) return
    profileAvatar.value = value

    const updated = await $fetch<User>('/api/auth/profile', {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token.value}` },
      body: { profileAvatar: value, profileAvatarFileId: fileId },
    })
    user.value = { ...user.value, profileAvatar: updated.profileAvatar ?? null }
    profileAvatar.value = user.value.profileAvatar ?? null
  }

  async function updateUsername(username: string): Promise<void> {
    if (!token.value || !user.value) return
    const updated = await $fetch<User>('/api/auth/profile', {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token.value}` },
      body: { username },
    })
    user.value = { ...user.value, username: updated.username }
  }

  async function fetchProfileAvatar(): Promise<string | null> {
    if (!token.value) return null

    try {
      const profile = await $fetch<Pick<User, 'profileAvatar'>>('/api/auth/profile', {
        headers: { Authorization: `Bearer ${token.value}` },
      })
      return profile.profileAvatar ?? null
    }
    catch {
      return null
    }
  }

  async function fetchUser(): Promise<void> {
    if (!token.value) return
    try {
      const data = await $fetch<User>(`${baseUrl}/api/users/me?populate=role`, {
        headers: { Authorization: `Bearer ${token.value}` },
      })
      const persistedAvatar = await fetchProfileAvatar()
      try {
        const subscriber = await $fetch<SubscriberStatus>('/api/auth/subscriber', {
          headers: { Authorization: `Bearer ${token.value}` },
        })
        setAuthenticatedUser({
          ...data,
          ...(subscriber.role ? { role: subscriber.role } : {}),
          profileAvatar: persistedAvatar,
        })
      }
      catch {
        setAuthenticatedUser({ ...data, profileAvatar: persistedAvatar })
      }
    }
    catch {
      // Token invalid or expired — clear it
      token.value = null
      user.value = null
      profileAvatar.value = null
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
    setAuthenticatedUser(data.user)
    await fetchUser()
  }

  async function confirmEmail(confirmation: string): Promise<void> {
    const data = await $fetch<AuthResponse>(
      `${baseUrl}/api/auth/email-confirmation?confirmation=${confirmation}`,
    )
    token.value = data.jwt
    setAuthenticatedUser(data.user)
    await fetchUser()
  }

  async function resendConfirmation(email: string): Promise<void> {
    await $fetch(`${baseUrl}/api/auth/send-email-confirmation`, {
      method: 'POST',
      body: { email },
    })
  }

  async function loginWithToken(jwt: string): Promise<void> {
    try {
      await $fetch<User>(`${baseUrl}/api/users/me?populate=role`, {
        headers: { Authorization: `Bearer ${jwt}` },
      })
      token.value = jwt
      await fetchUser()
    }
    catch (err) {
      token.value = null
      user.value = null
      profileAvatar.value = null
      throw err
    }
  }

  function connectWithProvider(provider: 'google' | 'facebook') {
    window.location.href = `${baseUrl}/api/connect/${provider}`
  }

  return {
    user: readonly(user),
    token: readonly(token),
    authReady,
    isAuthenticated,
    userRole,
    isSubscriber,
    userInitial,
    profileAvatar,
    login,
    register,
    logout,
    fetchUser,
    saveProfileAvatar,
    updateUsername,
    forgotPassword,
    resetPassword,
    confirmEmail,
    resendConfirmation,
    loginWithToken,
    connectWithProvider,
  }
}
