<template>
  <div class="flex min-h-[60vh] flex-col items-center justify-center px-4 pt-16 text-center">
    <p class="text-8xl font-bold text-iberia/20">404</p>
    <h1 class="mt-4 text-2xl font-bold text-zinc-800">{{ $t('nofound') }}</h1>
    <p class="mt-3 text-zinc-500">{{ $t('nofound2') }}</p>
    <div class="mt-8 flex flex-wrap justify-center gap-4">
      <NuxtLink
        :to="localePath('/')"
        class="rounded-xl bg-iberia px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-iberia-dark"
      >
        {{ $t('nofound3') }}
      </NuxtLink>
      <NuxtLink
        :to="localePath('/contact')"
        class="rounded-xl border border-zinc-200 px-6 py-3 text-sm font-semibold text-zinc-600 transition-all hover:border-zinc-300"
      >
        {{ $t('nofound5') }}
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
useSeoMeta({ title: `404 — ${t('nofound')}` })
</script>
