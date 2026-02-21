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
        <h1 class="font-display text-2xl font-bold text-zinc-900">{{ $t('auth.registerTitle') }}</h1>
        <p class="mt-2 text-sm text-zinc-500">{{ $t('auth.registerSubtitle') }}</p>
      </div>

      <!-- Success state -->
      <div v-if="success" class="rounded-xl border border-green-100 bg-green-50 px-5 py-6 text-center">
        <div class="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-green-100">
          <svg class="size-6 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 6L9 17l-5-5"/>
          </svg>
        </div>
        <h2 class="font-semibold text-zinc-900">{{ $t('auth.registerSuccessTitle') }}</h2>
        <p class="mt-1 text-sm text-zinc-500">{{ $t('auth.registerSuccessMessage') }}</p>
        <NuxtLink
          :to="localePath('/login')"
          class="mt-4 inline-block text-sm font-medium text-iberia hover:underline"
        >
          {{ $t('auth.goToLogin') }}
        </NuxtLink>
      </div>

      <!-- Form -->
      <form v-else class="space-y-4" @submit.prevent="handleRegister">
        <div v-if="error" class="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
          {{ error }}
        </div>

        <div>
          <label class="mb-1.5 block text-sm font-medium text-zinc-700">{{ $t('auth.username') }}</label>
          <input
            v-model="form.username"
            type="text"
            required
            autocomplete="username"
            class="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-iberia focus:ring-2 focus:ring-iberia/10"
            :placeholder="$t('auth.usernamePlaceholder')"
          />
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
          <label class="mb-1.5 block text-sm font-medium text-zinc-700">{{ $t('auth.password') }}</label>
          <input
            v-model="form.password"
            type="password"
            required
            autocomplete="new-password"
            class="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-iberia focus:ring-2 focus:ring-iberia/10"
            :placeholder="$t('auth.passwordPlaceholder')"
          />
          <!-- Requisitos visuales -->
          <ul v-if="form.password.length > 0" class="mt-2 space-y-1">
            <li
              v-for="rule in passwordRules"
              :key="rule.key"
              class="flex items-center gap-1.5 text-xs"
              :class="rule.valid ? 'text-green-600' : 'text-zinc-400'"
            >
              <svg class="size-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path v-if="rule.valid" d="M20 6L9 17l-5-5"/>
                <circle v-else cx="12" cy="12" r="9"/>
              </svg>
              {{ $t(rule.key) }}
            </li>
          </ul>
        </div>

        <div>
          <label class="mb-1.5 block text-sm font-medium text-zinc-700">{{ $t('auth.confirmPassword') }}</label>
          <input
            v-model="form.confirmPassword"
            type="password"
            required
            autocomplete="new-password"
            class="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-iberia focus:ring-2 focus:ring-iberia/10"
            :placeholder="$t('auth.confirmPasswordPlaceholder')"
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
          {{ $t('auth.register') }}
        </button>
      </form>

      <!-- Divider -->
      <div v-if="!success" class="relative my-5">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-zinc-200" />
        </div>
        <div class="relative flex justify-center">
          <span class="bg-white px-3 text-xs text-zinc-400">{{ $t('auth.orContinueWith') }}</span>
        </div>
      </div>

      <!-- Google -->
      <button
        v-if="!success"
        type="button"
        class="flex w-full items-center justify-center gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
        @click="connectWithProvider('google')"
      >
        <svg class="size-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        {{ $t('auth.continueWithGoogle') }}
      </button>

      <!-- Footer link -->
      <p v-if="!success" class="mt-6 text-center text-sm text-zinc-500">
        {{ $t('auth.hasAccount') }}
        <NuxtLink :to="localePath('/login')" class="font-medium text-iberia hover:underline">
          {{ $t('auth.login') }}
        </NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default', headerSolid: true })

const { t } = useI18n()
const localePath = useLocalePath()
const { register, isAuthenticated, connectWithProvider } = useAuth()

if (isAuthenticated.value) {
  await navigateTo(localePath('/account'))
}

const form = reactive({ username: '', email: '', password: '', confirmPassword: '' })
const loading = ref(false)
const error = ref('')
const success = ref(false)

const passwordRules = computed(() => [
  { key: 'auth.passwordRuleLength', valid: form.password.length >= 8 },
  { key: 'auth.passwordRuleUpper', valid: /[A-Z]/.test(form.password) },
  { key: 'auth.passwordRuleSpecial', valid: /[^A-Za-z0-9]/.test(form.password) },
])

const passwordValid = computed(() => passwordRules.value.every(r => r.valid))

async function handleRegister() {
  if (!passwordValid.value) {
    error.value = t('auth.passwordWeak')
    return
  }
  if (form.password !== form.confirmPassword) {
    error.value = t('auth.passwordMismatch')
    return
  }
  loading.value = true
  error.value = ''
  try {
    await register(form.username, form.email, form.password)
    success.value = true
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
