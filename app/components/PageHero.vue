<template>
  <section class="relative overflow-hidden bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 pb-20 pt-36 lg:pb-28 lg:pt-44">
    <!-- Blobs rojos -->
    <div class="absolute -right-40 -top-40 size-96 rounded-full bg-iberia/20 blur-3xl" />
    <div class="absolute -bottom-20 -left-20 size-64 rounded-full bg-iberia/10 blur-3xl" />
    <!-- Blobs amarillos — más sutiles -->
    <div class="absolute -right-24 top-1/2 size-72 -translate-y-1/2 rounded-full bg-yellow-400/8 blur-3xl" />
    <div class="absolute -top-10 left-1/3 size-56 rounded-full bg-yellow-300/6 blur-3xl" />

    <div class="container relative mx-auto px-4 lg:px-6">
      <div :class="centered ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'">

        <!-- Slot para contenido extra antes del título (ej: breadcrumb) -->
        <slot name="before" />

        <p v-if="eyebrow" class="text-sm font-semibold uppercase tracking-wider text-iberia">
          {{ eyebrow }}
        </p>

        <h1
          class="text-2xl font-bold leading-tight text-white lg:text-4xl xl:text-5xl"
          :class="[eyebrow ? 'mt-4' : 'mt-0', titleClass]"
        >
          {{ title }}
        </h1>

        <div
          v-if="subtitle"
          class="mt-6 text-sm leading-relaxed text-zinc-400 lg:text-lg"
          v-html="subtitle"
        />

        <!-- Slot para contenido extra tras el subtítulo (ej: botones) -->
        <slot />

      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  eyebrow?: string
  title: string
  titleClass?: string
  subtitle?: string
  centered?: boolean
}>()
</script>
