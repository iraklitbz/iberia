<template>
  <div>
    <PageHero :title="$t(categoryLabel)" title-class="capitalize">
      <template #before>
        <NuxtLink
          :to="localePath('/')"
          class="mb-4 inline-flex items-center gap-1.5 text-sm text-zinc-400 transition-colors hover:text-white"
        >
          <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          {{ $t('home') }}
        </NuxtLink>
      </template>
    </PageHero>

    <!-- Posts grid -->
    <section class="py-20 lg:py-28">
      <div class="container mx-auto px-4 lg:px-6">

        <!-- Loading skeleton (SSR) -->
        <div v-if="pending" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div v-for="i in 6" :key="i" class="h-80 animate-pulse rounded-2xl bg-zinc-100" />
        </div>

        <!-- Error -->
        <div v-else-if="error" class="py-20 text-center">
          <p class="text-zinc-400">{{ $t('error_charge_news') }}</p>
        </div>

        <!-- Empty -->
        <div v-else-if="!posts.length" class="py-20 text-center">
          <p class="text-zinc-400">{{ $t('no_more_news') }}</p>
        </div>

        <!-- Grid -->
        <div v-else>
          <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <PostCard v-for="post in posts" :key="post.id" :post="post" />
          </div>

          <!-- Load more -->
          <div v-if="hasNextPage" class="mt-12 flex justify-center">
            <button
              :disabled="loadingMore"
              class="inline-flex items-center gap-2 rounded-xl border border-zinc-200 px-8 py-3 text-sm font-medium text-zinc-600 transition-all hover:border-iberia hover:text-iberia disabled:opacity-50"
              @click="loadMore"
            >
              <svg v-if="loadingMore" class="size-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
              {{ loadingMore ? $t('loading') : $t('seemore') }}
            </button>
          </div>
        </div>

      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { Post } from '~/types/wordpress'
import { getPostsByCategory, getGeoPostsByCategory } from '~/composables/useWordpress'

const route = useRoute()
const { locale, t } = useI18n()
const localePath = useLocalePath()

const slug = computed(() => route.params.slug as string)

// Map slug → i18n key para el título
const categoryLabels: Record<string, string> = {
  news: 'news',
  events: 'events',
  activities: 'activities',
  curiosidades: 'curiosidades',
  programs: 'programs',
  tours: 'tours',
}
const categoryLabel = computed(() => categoryLabels[slug.value] ?? 'news')

// SSR: primer lote de posts
const { data: initialData, pending, error } = await useAsyncData(
  () => `category-${slug.value}-${locale.value}`,
  async () => {
    if (locale.value === 'es') {
      return getPostsByCategory(slug.value, 9)
    }
    return getGeoPostsByCategory(slug.value, 9)
  },
  { watch: [slug, locale] },
)

// Estado reactivo para paginación
const posts = ref<Post[]>([])
const hasNextPage = ref(false)
const endCursor = ref<string | null>(null)
const loadingMore = ref(false)

// Sincronizar con los datos SSR
watch(initialData, (data) => {
  if (data) {
    posts.value = data.edges.map(e => e.node)
    hasNextPage.value = data.pageInfo.hasNextPage
    endCursor.value = data.pageInfo.endCursor
  }
}, { immediate: true })

async function loadMore() {
  if (!hasNextPage.value || loadingMore.value) return
  loadingMore.value = true

  try {
    const more = locale.value === 'es'
      ? await getPostsByCategory(slug.value, 9, endCursor.value ?? undefined)
      : await getGeoPostsByCategory(slug.value, 9, endCursor.value ?? undefined)

    if (more) {
      posts.value.push(...more.edges.map(e => e.node))
      hasNextPage.value = more.pageInfo.hasNextPage
      endCursor.value = more.pageInfo.endCursor
    }
  }
  finally {
    loadingMore.value = false
  }
}

const url = useRequestURL()
const OG_IMAGE = 'https://iberiainfo.me/wp-content/uploads/2022/02/contact-scaled.jpg'

useSeoMeta({
  title: `${t(categoryLabel.value)} — Iberia`,
  ogTitle: t(categoryLabel.value),
  ogDescription: t('indexDescription'),
  ogImage: OG_IMAGE,
  ogUrl: url.href,
  ogType: 'website',
  twitterTitle: t(categoryLabel.value),
  twitterDescription: t('indexDescription'),
  twitterImage: OG_IMAGE,
})

useHead({ link: [{ rel: 'canonical', href: url.href }] })
</script>
