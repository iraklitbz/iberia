<template>
  <div
    class="flex items-center gap-1 rounded-full border p-0.5 text-sm transition-colors"
    :class="dark ? 'border-white/20' : 'border-zinc-200'"
  >
    <NuxtLink
      v-for="loc in locales"
      :key="loc.code"
      :to="switchLocalePath(loc.code)"
      class="rounded-full px-2.5 py-1 font-medium transition-colors"
      :class="
        locale === loc.code
          ? 'bg-iberia text-white'
          : dark
            ? 'text-white/70 hover:text-white'
            : 'text-zinc-500 hover:text-zinc-800'
      "
    >
      {{ loc.code.toUpperCase() }}
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
defineProps<{ dark?: boolean }>()

const { locale, locales } = useI18n()
const switchLocalePath = useSwitchLocalePath()
</script>
