<template>
  <div class="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 py-20 text-center">

    <!-- Número grande decorativo -->
    <div class="relative mb-6 select-none">
      <p class="text-[10rem] font-black leading-none text-zinc-100 lg:text-[14rem]">404</p>
      <div class="absolute inset-0 flex items-center justify-center">
        <svg class="size-16 text-iberia/30 lg:size-20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          <line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/>
        </svg>
      </div>
    </div>

    <h1 class="text-2xl font-bold text-zinc-800 lg:text-3xl">
      {{ $t('nofound') }}
    </h1>
    <p class="mt-3 max-w-sm text-zinc-500">
      {{ $t('nofound2') }}
    </p>

    <div class="mt-10 flex flex-wrap justify-center gap-3">
      <NuxtLink
        :to="localePath('/')"
        class="inline-flex items-center gap-2 rounded-xl bg-iberia px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-iberia-dark hover:shadow-md"
      >
        <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 12L12 3l9 9"/><path d="M9 21V12h6v9"/>
        </svg>
        {{ $t('nofound3') }}
      </NuxtLink>
      <NuxtLink
        :to="localePath('/contact')"
        class="inline-flex items-center gap-2 rounded-xl border border-zinc-200 px-6 py-3 text-sm font-semibold text-zinc-600 transition-all hover:border-zinc-300 hover:bg-zinc-50"
      >
        {{ $t('nofound5') }}
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()

definePageMeta({ layout: 'default', headerSolid: true })
useSeoMeta({ title: `404 — ${t('nofound')}` })
</script>
