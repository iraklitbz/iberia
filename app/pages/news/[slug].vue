<template>
  <div>
    <!-- Loading -->
    <div v-if="pending" class="container mx-auto max-w-3xl px-4 pb-20 pt-36 lg:px-6">
      <div class="h-8 w-2/3 animate-pulse rounded-xl bg-zinc-100" />
      <div class="mt-4 h-4 w-full animate-pulse rounded bg-zinc-100" />
      <div class="mt-2 h-4 w-4/5 animate-pulse rounded bg-zinc-100" />
      <div class="mt-8 aspect-video w-full animate-pulse rounded-2xl bg-zinc-100" />
    </div>

    <!-- Not found -->
    <div v-else-if="!post" class="flex min-h-[50vh] flex-col items-center justify-center px-4 text-center">
      <p class="text-5xl font-bold text-zinc-200">404</p>
      <h1 class="mt-4 text-xl font-semibold text-zinc-700">{{ $t('nofound') }}</h1>
      <NuxtLink :to="localePath('/')" class="mt-6 text-sm font-medium text-iberia hover:underline">
        {{ $t('nofound3') }}
      </NuxtLink>
    </div>

    <!-- Article -->
    <article v-else>

      <!-- Hero header -->
      <section class="relative overflow-hidden bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 pb-20 pt-36">
        <div class="absolute -right-40 -top-40 size-96 rounded-full bg-iberia/20 blur-3xl" />
        <div class="absolute -bottom-20 -left-20 size-64 rounded-full bg-iberia/10 blur-3xl" />
        <div class="absolute -right-24 top-1/2 size-72 -translate-y-1/2 rounded-full bg-yellow-400/8 blur-3xl" />
        <div class="container relative mx-auto max-w-3xl px-4 lg:px-6">
          <!-- Breadcrumb -->
          <nav class="mb-6 flex items-center gap-2 text-sm text-zinc-500">
            <NuxtLink :to="localePath('/')" class="hover:text-zinc-300 transition-colors">
              {{ $t('home') }}
            </NuxtLink>
            <span>/</span>
            <NuxtLink
              :to="localePath({ name: 'category-slug', params: { slug: 'news' } })"
              class="hover:text-zinc-300 transition-colors"
            >
              {{ $t('news') }}
            </NuxtLink>
          </nav>

          <h1 class="text-3xl font-bold leading-snug text-white lg:text-4xl">
            {{ post.title }}
          </h1>

          <div
            v-if="post.excerpt"
            class="mt-4 text-lg leading-relaxed text-zinc-400"
            v-html="cleanExcerpt(post.excerpt)"
          />

          <time v-if="post.date" class="mt-6 block text-sm text-zinc-500">
            {{ formatDate(post.date) }}
          </time>
        </div>
      </section>

      <!-- Featured image -->
      <div class="container mx-auto max-w-4xl px-4 lg:px-6">
        <div class="-mt-10 overflow-hidden rounded-2xl shadow-xl">
          <img
            v-if="post.featuredImage"
            :src="post.featuredImage.node.sourceUrl"
            :alt="post.title"
            class="w-full object-cover"
          />
          <div
            v-else
            class="flex aspect-video items-center justify-center bg-zinc-100"
          >
            <img
              src="https://iberiainfo.me/wp-content/uploads/2022/02/logo_iberia_icon.svg"
              alt="Iberia"
              class="size-16 opacity-20"
            />
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="container mx-auto max-w-3xl px-4 py-16 lg:px-6">
        <div
          class="cms-content"
          v-html="post.content"
        />

        <!-- Back to category -->
        <div class="mt-16 border-t border-zinc-100 pt-8">
          <NuxtLink
            :to="localePath({ name: 'category-slug', params: { slug: 'news' } })"
            class="inline-flex items-center gap-2 text-sm font-medium text-iberia hover:gap-3 transition-all"
          >
            <svg class="size-4 rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
            {{ $t('news') }}
          </NuxtLink>
        </div>
      </div>
    </article>
  </div>
</template>

<script setup lang="ts">
import { getPostBySlug, getGeoPostBySlug } from '~/composables/useWordpress'

const route = useRoute()
const { locale, t } = useI18n()
const localePath = useLocalePath()

const slug = computed(() => route.params.slug as string)

const { data: post, pending } = await useAsyncData(
  () => `post-${slug.value}-${locale.value}`,
  () => locale.value === 'es'
    ? getPostBySlug(slug.value)
    : getGeoPostBySlug(slug.value),
  { watch: [slug, locale] },
)

function cleanExcerpt(html: string) {
  return html.replace(/<\/?p>/g, '').trim()
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString(
    locale.value === 'ge' ? 'ka-GE' : 'es-ES',
    { year: 'numeric', month: 'long', day: 'numeric' },
  )
}

// Fix imágenes lazy del CMS de WordPress (quita srcset de gt3-lazy-image)
onMounted(() => {
  document.querySelectorAll('.gt3-lazy-image').forEach((img) => {
    img.removeAttribute('srcset')
  })
})

const url = useRequestURL()

const postTitle = computed(() => post.value?.title ?? 'Iberia')
const postDescription = computed(() =>
  post.value?.excerpt
    ? post.value.excerpt.replace(/<[^>]+>/g, '').trim()
    : t('indexDescription'),
)
const postImage = computed(() =>
  post.value?.featuredImage?.node.sourceUrl
  ?? 'https://iberiainfo.me/wp-content/uploads/2022/02/contact-scaled.jpg',
)

useSeoMeta({
  title: computed(() => `${postTitle.value} — Iberia`),
  description: postDescription,
  ogTitle: postTitle,
  ogDescription: postDescription,
  ogImage: postImage,
  ogUrl: url.href,
  ogType: 'article',
  ogLocale: computed(() => locale.value === 'ge' ? 'ka_GE' : 'es_ES'),
  articlePublishedTime: computed(() => post.value?.date ?? undefined),
  twitterTitle: postTitle,
  twitterDescription: postDescription,
  twitterImage: postImage,
})

useHead({
  link: [{ rel: 'canonical', href: url.href }],
  script: computed(() => post.value ? [{
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'NewsArticle',
      headline: post.value.title,
      datePublished: post.value.date,
      image: post.value.featuredImage?.node.sourceUrl,
      inLanguage: locale.value === 'ge' ? 'ka' : 'es',
      publisher: {
        '@type': 'Organization',
        name: 'Iberia',
        logo: {
          '@type': 'ImageObject',
          url: 'https://iberiainfo.me/wp-content/uploads/2022/05/logo.png',
        },
      },
      mainEntityOfPage: { '@type': 'WebPage', '@id': url.href },
    }),
  }] : []),
})
</script>
