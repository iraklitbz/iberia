<template>
  <div>

    <!-- Hero -->
    <section class="relative overflow-hidden bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 pb-28 pt-44 lg:pb-40 lg:pt-56">
      <!-- Decorative blobs — rojo (España) -->
      <div class="absolute -top-40 -right-40 size-96 rounded-full bg-iberia/20 blur-3xl" />
      <div class="absolute -bottom-20 -left-20 size-64 rounded-full bg-iberia/10 blur-3xl" />
      <!-- Decorative blobs — amarillo (España), más sutiles -->
      <div class="absolute top-1/2 -right-24 size-72 -translate-y-1/2 rounded-full bg-yellow-400/8 blur-3xl" />
      <div class="absolute -top-10 left-1/3 size-56 rounded-full bg-yellow-300/6 blur-3xl" />

      <div class="container relative mx-auto px-4 lg:px-6">
        <div class="max-w-3xl">
          <span class="inline-block rounded-full border border-iberia/30 bg-iberia/10 px-4 py-1.5 text-sm font-medium text-iberia">
            {{ $t('home2') }}
          </span>
          <h1 class="mt-6 text-4xl font-bold leading-tight text-white lg:text-5xl xl:text-6xl">
            {{ $t('indexTitle') }}
          </h1>
          <p class="mt-6 max-w-2xl text-lg leading-relaxed text-zinc-400">
            {{ $t('home3') }}
          </p>
          <div class="mt-10 flex flex-wrap gap-4">
            <NuxtLink
              :to="localePath('/contact')"
              class="inline-flex items-center gap-2 rounded-xl bg-iberia px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-iberia-dark hover:shadow-lg hover:shadow-iberia/25"
            >
              {{ $t('contactus') }}
              <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </NuxtLink>
            <NuxtLink
              :to="localePath('/about')"
              class="inline-flex items-center gap-2 rounded-xl border border-zinc-700 px-6 py-3 text-sm font-semibold text-zinc-300 transition-all hover:border-zinc-500 hover:text-white"
            >
              {{ $t('aboutus6') }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Latest news -->
    <section class="py-20 lg:py-28">
      <div class="container mx-auto px-4 lg:px-6">
        <div class="mb-12 flex items-end justify-between">
          <div>
            <p class="text-sm font-semibold tracking-wider text-iberia uppercase">Blog</p>
            <h2 class="mt-2 text-3xl font-bold text-zinc-800">{{ $t('home4') }}</h2>
          </div>
          <NuxtLink
            :to="localePath({ name: 'category-slug', params: { slug: 'news' } })"
            class="hidden items-center gap-1.5 text-sm font-medium text-iberia transition-all hover:gap-3 sm:flex"
          >
            {{ $t('seemore') }}
            <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </NuxtLink>
        </div>

        <div v-if="pending" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div v-for="i in 3" :key="i" class="h-72 animate-pulse rounded-2xl bg-zinc-100" />
        </div>

        <div v-else-if="posts?.length" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <PostCard v-for="post in posts.slice(0, 3)" :key="post.id" :post="post" />
        </div>

        <p v-else class="text-center text-zinc-400">{{ $t('no_more_news') }}</p>

        <div class="mt-8 sm:hidden">
          <NuxtLink
            :to="localePath({ name: 'category-slug', params: { slug: 'news' } })"
            class="block w-full rounded-xl border border-zinc-200 py-3 text-center text-sm font-medium text-zinc-600 transition-colors hover:border-iberia hover:text-iberia"
          >
            {{ $t('seemore') }}
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- About / Value proposition -->
    <section class="bg-zinc-50 py-20 lg:py-28">
      <div class="container mx-auto px-4 lg:px-6">
        <div class="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p class="text-sm font-semibold tracking-wider text-iberia uppercase">
              {{ $t('aboutus') }}
            </p>
            <h2
              class="mt-3 text-3xl font-bold leading-snug text-zinc-800"
              v-html="$t('home5')"
            />
            <ul class="mt-8 space-y-5">
              <li class="flex gap-4">
                <span class="mt-1 flex size-6 shrink-0 items-center justify-center rounded-full bg-iberia/10">
                  <svg class="size-3.5 text-iberia" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20 6L9 17l-5-5"/>
                  </svg>
                </span>
                <p class="text-zinc-600 leading-relaxed">{{ $t('home7') }}</p>
              </li>
              <li class="flex gap-4">
                <span class="mt-1 flex size-6 shrink-0 items-center justify-center rounded-full bg-iberia/10">
                  <svg class="size-3.5 text-iberia" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20 6L9 17l-5-5"/>
                  </svg>
                </span>
                <p class="text-zinc-600 leading-relaxed">{{ $t('home8') }}</p>
              </li>
            </ul>
            <NuxtLink
              :to="localePath('/about')"
              class="mt-8 inline-flex items-center gap-2 rounded-xl bg-iberia px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-iberia-dark"
            >
              {{ $t('aboutus6') }}
            </NuxtLink>
          </div>

          <!-- Diamond grid photos -->
          <div class="grid grid-cols-2 gap-4">
            <div class="aspect-square overflow-hidden rounded-2xl">
              <img src="https://res.cloudinary.com/dj6draudd/image/upload/v1771671535/kety_914387b234.jpg" alt="Equipo Iberia" class="size-full object-cover" loading="lazy" />
            </div>
            <div class="aspect-square overflow-hidden rounded-2xl mt-8">
              <img src="https://res.cloudinary.com/dj6draudd/image/upload/v1771671524/ani_d5ee585957.jpg" alt="Equipo Iberia" class="size-full object-cover" loading="lazy" />
            </div>
            <div class="aspect-square overflow-hidden rounded-2xl">
              <img src="https://res.cloudinary.com/dj6draudd/image/upload/v1771671511/Lana_602a5902aa.jpg" alt="Equipo Iberia" class="size-full object-cover" loading="lazy" />
            </div>
            <div class="aspect-square overflow-hidden rounded-2xl mt-8">
              <img src="https://res.cloudinary.com/dj6draudd/image/upload/v1771675264/tako_7aa23e6a3a.jpg" alt="Equipo Iberia" class="size-full object-cover" loading="lazy" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Partners -->
    <section class="py-20 lg:py-24">
      <div class="container mx-auto px-4 lg:px-6">
        <p class="mb-10 text-center text-sm font-semibold tracking-wider text-zinc-400 uppercase">
          {{ $t('home9') }}
        </p>
        <div class="flex flex-wrap items-center justify-center gap-6 opacity-60 grayscale transition-all duration-500 hover:opacity-100 hover:grayscale-0">
          <img v-for="partner in partners" :key="partner.alt" :src="partner.src" :alt="partner.alt" class="h-10 w-auto object-contain" loading="lazy" />
        </div>
      </div>
    </section>

    <!-- Team CTA -->
    <section class="relative overflow-hidden bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 py-20">
      <!-- Blobs rojos -->
      <div class="absolute -left-40 -top-40 size-96 rounded-full bg-iberia/15 blur-3xl" />
      <div class="absolute -bottom-20 -right-20 size-64 rounded-full bg-iberia/10 blur-3xl" />
      <!-- Blobs amarillos -->
      <div class="absolute left-1/2 top-1/2 size-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-yellow-400/6 blur-3xl" />
      <div class="container relative mx-auto px-4 text-center lg:px-6">
        <h2 class="text-3xl font-bold text-white">{{ $t('aboutus4') }}</h2>
        <p class="mt-4 text-lg text-zinc-400">{{ $t('aboutus5') }}</p>
        <NuxtLink
          :to="localePath('/our-team')"
          class="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-zinc-900 transition-all hover:bg-zinc-100"
        >
          {{ $t('ourteam') }}
          <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </NuxtLink>
      </div>
    </section>

  </div>
</template>

<script setup lang="ts">
import { getHomePosts } from '~/composables/useStrapi'

const { locale, t } = useI18n()
const localePath = useLocalePath()

const { data: posts, pending } = await useAsyncData(
  'home-posts',
  () => getHomePosts(locale.value),
  { watch: [locale] },
)

const url = useRequestURL()
const OG_IMAGE = 'https://res.cloudinary.com/dj6draudd/image/upload/v1771671526/contact_scaled_8ca2bf7adb.jpg'

useSeoMeta({
  title: t('indexTitle'),
  description: t('indexDescription'),
  ogTitle: t('indexTitle'),
  ogDescription: t('indexDescription'),
  ogImage: OG_IMAGE,
  ogUrl: url.href,
  ogType: 'website',
  ogLocale: locale.value === 'ge' ? 'ka_GE' : 'es_ES',
  twitterTitle: t('indexTitle'),
  twitterDescription: t('indexDescription'),
  twitterImage: OG_IMAGE,
})

useHead({
  link: [{ rel: 'canonical', href: url.href }],
  script: [{
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Centro Cultural y Educativo Español Iberia',
      alternateName: 'Iberia',
      url: 'https://iberiainfo.org',
      logo: 'https://res.cloudinary.com/dj6draudd/image/upload/v1771671618/logo_1404f77b5f.png',
      description: t('indexDescription'),
      contactPoint: [{
        '@type': 'ContactPoint',
        telephone: '+995-599-634-393',
        contactType: 'customer service',
        availableLanguage: ['Spanish', 'Georgian'],
      }],
      sameAs: [
        'https://www.facebook.com/CentroHispanoGeorgiano/',
        'https://youtube.com/user/asociacioniberia',
      ],
    }),
  }],
})

const partners = [
  { src: 'https://res.cloudinary.com/dj6draudd/image/upload/v1771671709/unnamed_1_652d1f197b.jpg', alt: 'Universidad' },
  { src: 'https://res.cloudinary.com/dj6draudd/image/upload/v1771671530/gau_en_2_7eea4ab556.png', alt: 'GAU' },
  { src: 'https://res.cloudinary.com/dj6draudd/image/upload/v1771675151/hablamos_015c8f3162.png', alt: 'Hablamos Escuela' },
  { src: 'https://res.cloudinary.com/dj6draudd/image/upload/v1771675151/logo_ua_5e1063ac71.jpg', alt: 'Universidad de Alicante' },
  { src: 'https://res.cloudinary.com/dj6draudd/image/upload/v1771675151/escudouva_a992162a1d.png', alt: 'Universidad de Valladolid' },
  { src: 'https://res.cloudinary.com/dj6draudd/image/upload/v1771675151/escola_1265e7daa7.png', alt: 'Escola de Enoturismo' },
  { src: 'https://res.cloudinary.com/dj6draudd/image/upload/v1771675151/logo_um_peq_06afad17b2.png', alt: 'Universidad de Murcia' },
  { src: 'https://res.cloudinary.com/dj6draudd/image/upload/v1771675151/aia_2_ae945959a7.jpg', alt: 'AIA' },
  { src: 'https://res.cloudinary.com/dj6draudd/image/upload/v1771671512/UBU_f0498d57c9.png', alt: 'Universidad de Burgos' },
  { src: 'https://res.cloudinary.com/dj6draudd/image/upload/v1771671570/rioja_76533187a8.gif', alt: 'Universidad de La Rioja' },
  { src: 'https://res.cloudinary.com/dj6draudd/image/upload/v1771671571/seu_467ba4d2c9.png', alt: 'SEU' },
  { src: 'https://res.cloudinary.com/dj6draudd/image/upload/v1771671560/logo_ihdemu_bdc0bd50cf.jpg', alt: 'IHDEMU' },
  { src: 'https://res.cloudinary.com/dj6draudd/image/upload/v1771671528/cyleon_829a9a9b86.png', alt: 'Cyleon' },
]
</script>
