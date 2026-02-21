<template>
  <div class="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-20">
    <div class="w-full max-w-md text-center">

      <NuxtLink :to="localePath('/')" class="mb-6 inline-flex items-center justify-center">
        <img
          src="https://res.cloudinary.com/dj6draudd/image/upload/v1771671543/logo_iberia_icon_b2924031c3.svg"
          alt="Iberia"
          width="40"
          height="40"
          class="size-10"
        />
      </NuxtLink>

      <!-- Loading -->
      <div v-if="status === 'loading'" class="mt-6">
        <svg class="mx-auto size-8 animate-spin text-iberia" viewBox="0 0 24 24" fill="none">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
        <p class="mt-4 text-sm text-zinc-500">{{ $t('auth.confirmingEmail') }}</p>
      </div>

      <!-- Success -->
      <div v-else-if="status === 'success'" class="mt-6">
        <div class="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-green-100">
          <svg class="size-8 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 6L9 17l-5-5"/>
          </svg>
        </div>
        <h1 class="font-display text-2xl font-bold text-zinc-900">{{ $t('auth.confirmEmailSuccessTitle') }}</h1>
        <p class="mt-2 text-sm text-zinc-500">{{ $t('auth.confirmEmailSuccessMessage') }}</p>
        <NuxtLink
          :to="localePath('/account')"
          class="mt-6 inline-flex items-center justify-center rounded-xl bg-iberia px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          {{ $t('auth.goToAccount') }}
        </NuxtLink>
      </div>

      <!-- Error -->
      <div v-else-if="status === 'error'" class="mt-6">
        <div class="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-red-100">
          <svg class="size-8 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
        </div>
        <h1 class="font-display text-2xl font-bold text-zinc-900">{{ $t('auth.confirmEmailErrorTitle') }}</h1>
        <p class="mt-2 text-sm text-zinc-500">{{ errorMessage }}</p>
        <NuxtLink
          :to="localePath('/login')"
          class="mt-6 inline-block text-sm font-medium text-iberia hover:underline"
        >
          {{ $t('auth.goToLogin') }}
        </NuxtLink>
      </div>

      <!-- No token -->
      <div v-else class="mt-6">
        <p class="text-sm text-zinc-500">{{ $t('auth.confirmInvalidLink') }}</p>
        <NuxtLink :to="localePath('/login')" class="mt-3 inline-block text-sm font-medium text-iberia hover:underline">
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
const route = useRoute()
const { confirmEmail } = useAuth()

const confirmation = route.query.confirmation as string | undefined

type Status = 'idle' | 'loading' | 'success' | 'error'
const status = ref<Status>(confirmation ? 'loading' : 'idle')
const errorMessage = ref('')

if (confirmation) {
  try {
    await confirmEmail(confirmation)
    status.value = 'success'
  }
  catch (err: unknown) {
    const e = err as { data?: { error?: { message?: string } } }
    errorMessage.value = e?.data?.error?.message ?? t('auth.errorGeneric')
    status.value = 'error'
  }
}
</script>
