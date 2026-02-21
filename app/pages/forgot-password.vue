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
        <h1 class="font-display text-2xl font-bold text-zinc-900">{{ $t('auth.forgotPasswordTitle') }}</h1>
        <p class="mt-2 text-sm text-zinc-500">{{ $t('auth.forgotPasswordSubtitle') }}</p>
      </div>

      <!-- Success state -->
      <div v-if="success" class="rounded-xl border border-green-100 bg-green-50 px-5 py-6 text-center">
        <div class="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-green-100">
          <svg class="size-6 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 7l10 7 10-7"/>
          </svg>
        </div>
        <h2 class="font-semibold text-zinc-900">{{ $t('auth.forgotPasswordSuccessTitle') }}</h2>
        <p class="mt-1 text-sm text-zinc-500">{{ $t('auth.forgotPasswordSuccessMessage') }}</p>
        <NuxtLink
          :to="localePath('/login')"
          class="mt-4 inline-block text-sm font-medium text-iberia hover:underline"
        >
          {{ $t('auth.goToLogin') }}
        </NuxtLink>
      </div>

      <!-- Form -->
      <form v-else class="space-y-4" @submit.prevent="handleForgot">
        <div v-if="error" class="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
          {{ error }}
        </div>

        <div>
          <label class="mb-1.5 block text-sm font-medium text-zinc-700">{{ $t('auth.email') }}</label>
          <input
            v-model="email"
            type="email"
            required
            autocomplete="email"
            class="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-iberia focus:ring-2 focus:ring-iberia/10"
            :placeholder="$t('auth.emailPlaceholder')"
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
          {{ $t('auth.sendResetLink') }}
        </button>
      </form>

      <p class="mt-6 text-center text-sm text-zinc-500">
        <NuxtLink :to="localePath('/login')" class="font-medium text-iberia hover:underline">
          ← {{ $t('auth.backToLogin') }}
        </NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default', headerSolid: true })

const { t } = useI18n()
const localePath = useLocalePath()
const { forgotPassword } = useAuth()

const email = ref('')
const loading = ref(false)
const error = ref('')
const success = ref(false)

async function handleForgot() {
  loading.value = true
  error.value = ''
  try {
    await forgotPassword(email.value)
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
