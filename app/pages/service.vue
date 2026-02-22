<template>
  <div>
    <PageHero
      eyebrow="Iberia"
      :title="$t('service')"
      :subtitle="$t('service1')"
    />

    <!-- Services list -->
    <section class="py-20 lg:py-28">
      <div class="container mx-auto px-4 lg:px-6">
        <div class="mx-auto max-w-3xl divide-y divide-zinc-100">
          <div
            v-for="service in services"
            :key="service.labelKey"
            class="flex gap-6 py-10 first:pt-0 last:pb-0"
          >
            <!-- Icon -->
            <div class="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-iberia/8 text-iberia">
              <component :is="service.icon" class="size-7" />
            </div>

            <!-- Text -->
            <div>
              <h3 class="text-lg font-semibold text-zinc-800">{{ $t(service.labelKey) }}</h3>
              <p class="mt-2 leading-relaxed text-zinc-500">{{ $t(service.descKey) }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="border-t border-zinc-100 bg-zinc-50 py-16">
      <div class="container mx-auto px-4 text-center lg:px-6">
        <h2 class="text-2xl font-bold text-zinc-800">{{ $t('contact1') }}</h2>
        <p class="mt-3 text-zinc-500">{{ $t('contact2') }}</p>
        <NuxtLink
          :to="localePath('/contact')"
          class="mt-8 inline-flex items-center gap-2 rounded-xl bg-iberia px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-iberia-dark"
        >
          {{ $t('contactus') }}
          <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { defineComponent, h } from 'vue'
definePageMeta({ layout: 'default', headerSolid: true })

const { t } = useI18n()
const localePath = useLocalePath()

const url = useRequestURL()
const OG_IMAGE = 'https://res.cloudinary.com/dj6draudd/image/upload/v1771671526/contact_scaled_8ca2bf7adb.jpg'

useSeoMeta({
  title: `${t('service')} — Iberia`,
  description: t('service1'),
  ogTitle: t('service'),
  ogDescription: t('service1'),
  ogImage: OG_IMAGE,
  ogUrl: url.href,
  ogType: 'website',
  twitterTitle: t('service'),
  twitterDescription: t('service1'),
  twitterImage: OG_IMAGE,
})

useHead({ link: [{ rel: 'canonical', href: url.href }] })

// Iconos SVG inline como componentes Vue — sin @apply, sin imágenes externas
const IconDocuments = defineComponent({
  render: () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.75', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [
    h('path', { d: 'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z' }),
    h('polyline', { points: '14 2 14 8 20 8' }),
    h('line', { x1: '16', y1: '13', x2: '8', y2: '13' }),
    h('line', { x1: '16', y1: '17', x2: '8', y2: '17' }),
    h('polyline', { points: '10 9 9 9 8 9' }),
  ]),
})

const IconBuilding = defineComponent({
  render: () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.75', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [
    h('rect', { x: '3', y: '9', width: '18', height: '13', rx: '2' }),
    h('path', { d: 'M8 9V5a2 2 0 012-2h4a2 2 0 012 2v4' }),
    h('line', { x1: '12', y1: '12', x2: '12', y2: '18' }),
    h('line', { x1: '9', y1: '15', x2: '15', y2: '15' }),
  ]),
})

const IconScale = defineComponent({
  render: () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.75', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [
    h('line', { x1: '12', y1: '3', x2: '12', y2: '21' }),
    h('path', { d: 'M3 9l4-4 4 4' }),
    h('path', { d: 'M17 5l4 4-4 4' }),
    h('path', { d: 'M5 20h14' }),
    h('path', { d: 'M3 9h18' }),
  ]),
})

const IconCompass = defineComponent({
  render: () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.75', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [
    h('circle', { cx: '12', cy: '12', r: '10' }),
    h('polygon', { points: '16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76' }),
  ]),
})

const services = [
  {
    icon: IconDocuments,
    labelKey: 'service_title_2',
    descKey: 'service2',
  },
  {
    icon: IconBuilding,
    labelKey: 'service_title_3',
    descKey: 'service3',
  },
  {
    icon: IconScale,
    labelKey: 'service_title_4',
    descKey: 'service4',
  },
  {
    icon: IconCompass,
    labelKey: 'service_title_5',
    descKey: 'service5',
  },
]
</script>
