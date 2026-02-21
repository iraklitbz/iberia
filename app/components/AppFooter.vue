<template>
  <footer class="bg-zinc-900 text-zinc-400">

    <div class="container mx-auto px-4 py-14 lg:px-6">
      <div class="grid gap-10 lg:grid-cols-4">

        <!-- Brand + social -->
        <div class="lg:col-span-1">
          <NuxtLink :to="localePath('/')" class="inline-flex items-center gap-3">
            <img
              src="https://res.cloudinary.com/dj6draudd/image/upload/v1771671543/logo_iberia_icon_b2924031c3.svg"
              alt="Iberia"
              width="40"
              height="40"
              class="size-10 brightness-0 invert"
            />
            <img
              src="https://res.cloudinary.com/dj6draudd/image/upload/v1771671557/logo_iberia_text_1_9fda9ff279.svg"
              alt="Iberia"
              width="110"
              height="32"
              class="h-8 w-auto brightness-0 invert"
            />
          </NuxtLink>

          <p class="mt-4 text-sm leading-relaxed text-zinc-500">
            {{ $t('indexDescription') }}
          </p>

          <div class="mt-6 flex items-center gap-3">
            <a
              href="https://www.facebook.com/CentroHispanoGeorgiano/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              class="flex size-8 items-center justify-center rounded-full bg-zinc-800 text-zinc-400 transition-colors hover:bg-iberia hover:text-white"
            >
              <svg class="size-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a
              href="https://youtube.com/user/asociacioniberia"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              class="flex size-8 items-center justify-center rounded-full bg-zinc-800 text-zinc-400 transition-colors hover:bg-iberia hover:text-white"
            >
              <svg class="size-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
          </div>
        </div>

        <!-- Sitemap -->
        <div>
          <h4 class="mb-4 text-sm font-semibold tracking-wider text-zinc-200 uppercase">
            {{ $t('mapaweb') }}
          </h4>
          <ul class="space-y-2.5">
            <li v-for="link in mainLinks" :key="link.to">
              <NuxtLink
                :to="localePath(link.to)"
                class="text-sm transition-colors hover:text-white"
              >
                {{ $t(link.labelKey) }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- News categories -->
        <div>
          <h4 class="mb-4 text-sm font-semibold tracking-wider text-zinc-200 uppercase">
            {{ $t('news') }}
          </h4>
          <ul class="space-y-2.5">
            <li v-for="cat in newsCategories" :key="cat.slug">
              <NuxtLink
                :to="localePath({ name: 'category-slug', params: { slug: cat.slug } })"
                class="text-sm transition-colors hover:text-white"
              >
                {{ $t(cat.labelKey) }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Contact info -->
        <div>
          <h4 class="mb-4 text-sm font-semibold tracking-wider text-zinc-200 uppercase">
            {{ $t('contactus') }}
          </h4>
          <ul class="space-y-3">
            <li>
              <a
                href="mailto:asociacioniberia@gmail.com"
                class="flex items-center gap-2 text-sm transition-colors hover:text-white"
              >
                <svg class="size-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 7l10 7 10-7"/>
                </svg>
                asociacioniberia@gmail.com
              </a>
            </li>
            <li>
              <a href="tel:+995599634393" class="flex items-center gap-2 text-sm transition-colors hover:text-white">
                <svg class="size-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 8.81 19.79 19.79 0 01.02 2.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16z"/>
                </svg>
                +995 599 634 393
              </a>
            </li>
            <li class="pl-6">
              <a href="tel:+995568618086" class="text-sm transition-colors hover:text-white">
                +995 568 61 80 86
              </a>
            </li>
            <li class="pl-6">
              <a href="tel:+34722512017" class="text-sm transition-colors hover:text-white">
                +34 722 512 017
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Bottom bar -->
    <div class="border-t border-zinc-800">
      <div class="container mx-auto flex flex-col items-center justify-between gap-3 px-4 py-5 text-xs sm:flex-row lg:px-6">
        <p>© {{ new Date().getFullYear() }} iberiainfo.org. Todos los derechos reservados.</p>
        <div class="flex items-center gap-4">
          <NuxtLink :to="localePath('/politica-de-privacidad')" class="transition-colors hover:text-white">
            {{ $t('privacypolicy') }}
          </NuxtLink>
          <NuxtLink :to="localePath('/politica-cookies')" class="transition-colors hover:text-white">
            {{ $t('cookiespolicy') }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const localePath = useLocalePath()

const mainLinks = [
  { to: '/', labelKey: 'home' },
  { to: '/about', labelKey: 'aboutus' },
  { to: '/our-team', labelKey: 'ourteam' },
  { to: '/service', labelKey: 'service' },
  { to: '/contact', labelKey: 'contactus' },
]

const newsCategories = [
  { slug: 'news', labelKey: 'news' },
  { slug: 'events', labelKey: 'events' },
  { slug: 'activities', labelKey: 'activities' },
  { slug: 'programs', labelKey: 'programs' },
  { slug: 'tours', labelKey: 'tours' },
]
</script>
