<template>
  <div class="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-20">
    <div class="w-full max-w-md text-center">
      <NuxtLink :to="localePath('/')" class="mb-8 inline-flex items-center justify-center">
        <img
          src="https://res.cloudinary.com/dj6draudd/image/upload/v1771705953/logo_70e5917c59.png"
          alt="Iberia"
          class="h-14 w-auto"
        />
      </NuxtLink>

      <div v-if="status === 'loading'" class="mt-6">
        <svg class="mx-auto size-8 animate-spin text-iberia" viewBox="0 0 24 24" fill="none">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
        <p class="mt-4 text-sm text-zinc-500">{{ $t('auth.signingIn') }}</p>
      </div>

      <div v-else-if="status === 'error'" class="mt-6">
        <div class="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-red-100">
          <svg class="size-7 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
        </div>
        <p class="text-sm text-zinc-500">{{ errorMessage }}</p>
        <NuxtLink :to="localePath('/login')" class="mt-4 inline-block text-sm font-medium text-iberia hover:underline">
          {{ $t('auth.goToLogin') }}
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default', headerSolid: true })

const { t } = useI18n()
const localePath = useLocalePath()
const router = useRouter()
const route = useRoute()
const { loginWithToken } = useAuth()

type Status = 'loading' | 'error'
const status = useState<Status>('oauth-callback-status', () => 'loading')
const errorMessage = useState('oauth-callback-error', () => '')

await callOnce(async () => {
  const accessToken = route.query.access_token as string | undefined

  if (!accessToken) {
    errorMessage.value = t('auth.errorGeneric')
    status.value = 'error'
    return
  }

  try {
    await loginWithToken(accessToken)
    await router.push(localePath('/account'))
  }
  catch {
    errorMessage.value = t('auth.errorGeneric')
    status.value = 'error'
  }
})
</script>
