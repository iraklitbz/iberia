<template>
  <div class="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-20">
    <div class="w-full max-w-md">

      <!-- Header -->
      <div class="mb-8 text-center">
        <NuxtLink :to="localePath('/')" class="mb-6 inline-flex items-center justify-center">
          <img
            src="https://res.cloudinary.com/dj6draudd/image/upload/v1771671543/logo_iberia_icon_b2924031c3.svg"
            alt="Iberia"
            width="40"
            height="40"
            class="size-10"
          />
        </NuxtLink>
        <h1 class="font-display text-2xl font-bold text-zinc-900">{{ $t('auth.loginTitle') }}</h1>
        <p class="mt-2 text-sm text-zinc-500">{{ $t('auth.loginSubtitle') }}</p>
      </div>

      <!-- Form -->
      <form class="space-y-4" @submit.prevent="handleLogin">
        <div v-if="error" class="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
          {{ error }}
        </div>

        <div>
          <label class="mb-1.5 block text-sm font-medium text-zinc-700">{{ $t('auth.email') }}</label>
          <input
            v-model="form.email"
            type="email"
            required
            autocomplete="email"
            class="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-iberia focus:ring-2 focus:ring-iberia/10"
            :placeholder="$t('auth.emailPlaceholder')"
          />
        </div>

        <div>
          <div class="mb-1.5 flex items-center justify-between">
            <label class="text-sm font-medium text-zinc-700">{{ $t('auth.password') }}</label>
            <NuxtLink
              :to="localePath('/forgot-password')"
              class="text-xs text-iberia hover:underline"
            >
              {{ $t('auth.forgotPasswordLink') }}
            </NuxtLink>
          </div>
          <input
            v-model="form.password"
            type="password"
            required
            autocomplete="current-password"
            class="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-iberia focus:ring-2 focus:ring-iberia/10"
            :placeholder="$t('auth.passwordPlaceholder')"
          />
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="flex w-full items-center justify-center gap-2 rounded-xl bg-iberia px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <svg v-if="loading" class="size-4 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
          {{ $t('auth.login') }}
        </button>
      </form>

      <!-- Footer link -->
      <p class="mt-6 text-center text-sm text-zinc-500">
        {{ $t('auth.noAccount') }}
        <NuxtLink :to="localePath('/register')" class="font-medium text-iberia hover:underline">
          {{ $t('auth.createAccount') }}
        </NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default', headerSolid: true })

const { t } = useI18n()
const localePath = useLocalePath()
const router = useRouter()
const { login, isAuthenticated } = useAuth()

// Redirect if already logged in
if (isAuthenticated.value) {
  await navigateTo(localePath('/account'))
}

const form = reactive({ email: '', password: '' })
const loading = ref(false)
const error = ref('')

async function handleLogin() {
  loading.value = true
  error.value = ''
  try {
    await login(form.email, form.password)
    await router.push(localePath('/account'))
  }
  catch (err: unknown) {
    const e = err as { data?: { error?: { message?: string } } }
    error.value = e?.data?.error?.message ?? t('auth.errorGeneric')
  }
  finally {
    loading.value = false
  }
}
</script>
