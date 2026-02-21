<template>
  <header
    class="fixed inset-x-0 top-0 z-50 transition-all duration-300"
    :class="scrolled ? 'bg-white/95 shadow-sm backdrop-blur-sm' : 'border-b border-white/8 bg-zinc-900/30 backdrop-blur-xl'"
  >
    <div class="container mx-auto flex h-16 items-center justify-between px-4 lg:px-6">

      <!-- Logo -->
      <NuxtLink :to="localePath('/')" class="flex shrink-0 items-center gap-2.5">
        <img
          src="https://res.cloudinary.com/dj6draudd/image/upload/v1771671543/logo_iberia_icon_b2924031c3.svg"
          alt="Iberia"
          width="36"
          height="36"
          class="size-9 transition-all duration-300"
          :class="scrolled ? '' : 'brightness-0 invert'"
        />
        <img
          src="https://res.cloudinary.com/dj6draudd/image/upload/v1771671557/logo_iberia_text_1_9fda9ff279.svg"
          alt="Iberia"
          width="100"
          height="30"
          class="h-[30px] w-auto transition-all duration-300"
          :class="scrolled ? '' : 'brightness-0 invert'"
        />
      </NuxtLink>

      <!-- Desktop nav -->
      <nav class="font-display hidden items-center gap-1 lg:flex">
        <NuxtLink
          :to="localePath('/')"
          class="rounded-lg px-3 py-2 text-sm font-medium transition-colors"
          :class="scrolled ? 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900' : 'text-white hover:bg-white/10'"
          active-class="!text-iberia"
          exact
        >
          {{ $t('home') }}
        </NuxtLink>

        <!-- Dropdown Noticias -->
        <div ref="newsDropdownRef" class="relative">
          <button
            class="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
            :class="scrolled ? 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900' : 'text-white hover:bg-white/10'"
            @click="newsOpen = !newsOpen"
          >
            {{ $t('news') }}
            <svg
              class="size-3.5 transition-transform duration-200"
              :class="newsOpen ? 'rotate-180' : ''"
              viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"
            >
              <path d="M6 9l6 6 6-6"/>
            </svg>
          </button>

          <Transition name="dropdown">
            <div
              v-if="newsOpen"
              class="absolute left-1/2 top-full z-50 mt-2 w-48 -translate-x-1/2 rounded-xl border border-zinc-100 bg-white p-1.5 shadow-lg shadow-zinc-200/60"
            >
              <NuxtLink
                v-for="cat in newsCategories"
                :key="cat.slug"
                :to="localePath({ name: 'category-slug', params: { slug: cat.slug } })"
                class="block rounded-lg px-3 py-2 text-sm text-zinc-600 transition-colors hover:bg-zinc-50 hover:text-zinc-900"
                active-class="text-iberia bg-zinc-50"
                @click="newsOpen = false"
              >
                {{ $t(cat.labelKey) }}
              </NuxtLink>
            </div>
          </Transition>
        </div>

        <NuxtLink
          :to="localePath('/about')"
          class="rounded-lg px-3 py-2 text-sm font-medium transition-colors"
          :class="scrolled ? 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900' : 'text-white hover:bg-white/10'"
          active-class="!text-iberia"
        >
          {{ $t('aboutus') }}
        </NuxtLink>

        <NuxtLink
          :to="localePath('/service')"
          class="rounded-lg px-3 py-2 text-sm font-medium transition-colors"
          :class="scrolled ? 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900' : 'text-white hover:bg-white/10'"
          active-class="!text-iberia"
        >
          {{ $t('service') }}
        </NuxtLink>

        <NuxtLink
          :to="localePath('/contact')"
          class="ml-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
          :class="scrolled ? 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900' : 'text-white hover:bg-white/10'"
          active-class="!text-iberia"
        >
          {{ $t('contactus') }}
        </NuxtLink>
      </nav>

      <!-- Right side: language + hamburger -->
      <div class="flex items-center gap-3">
        <AppLanguage class="hidden sm:flex" :dark="!scrolled" />

        <button
          class="flex size-9 items-center justify-center rounded-lg transition-colors lg:hidden"
          :class="scrolled ? 'text-zinc-600 hover:bg-zinc-100' : 'text-white hover:bg-white/10'"
          :aria-label="menuOpen ? 'Cerrar menú' : 'Abrir menú'"
          @click="menuOpen = !menuOpen"
        >
          <svg v-if="!menuOpen" class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
          <svg v-else class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Mobile menu -->
    <Transition name="mobile-menu">
      <div
        v-if="menuOpen"
        class="border-t border-zinc-100 bg-white px-4 pb-4 lg:hidden"
      >
        <nav class="font-display flex flex-col gap-1 pt-2">
          <NuxtLink
            :to="localePath('/')"
            class="block rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
            active-class="text-iberia bg-iberia/5"
            exact
            @click="menuOpen = false"
          >
            {{ $t('home') }}
          </NuxtLink>

          <div>
            <p class="px-3 pb-1 pt-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">
              {{ $t('news') }}
            </p>
            <NuxtLink
              v-for="cat in newsCategories"
              :key="cat.slug"
              :to="localePath({ name: 'category-slug', params: { slug: cat.slug } })"
              class="block rounded-lg px-3 py-2 pl-5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
              active-class="text-iberia bg-iberia/5"
              @click="menuOpen = false"
            >
              {{ $t(cat.labelKey) }}
            </NuxtLink>
          </div>

          <NuxtLink
            :to="localePath('/about')"
            class="block rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
            active-class="text-iberia bg-iberia/5"
            @click="menuOpen = false"
          >
            {{ $t('aboutus') }}
          </NuxtLink>

          <NuxtLink
            :to="localePath('/service')"
            class="block rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
            active-class="text-iberia bg-iberia/5"
            @click="menuOpen = false"
          >
            {{ $t('service') }}
          </NuxtLink>

          <NuxtLink
            :to="localePath('/contact')"
            class="block rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
            active-class="text-iberia bg-iberia/5"
            @click="menuOpen = false"
          >
            {{ $t('contactus') }}
          </NuxtLink>

          <div class="pt-2">
            <AppLanguage />
          </div>
        </nav>
      </div>
    </Transition>
  </header>
</template>

<script setup lang="ts">
const localePath = useLocalePath()

const scrolled = ref(false)
const menuOpen = ref(false)
const newsOpen = ref(false)
const newsDropdownRef = ref<HTMLElement | null>(null)

const newsCategories = [
  { slug: 'news', labelKey: 'news' },
  { slug: 'events', labelKey: 'events' },
  { slug: 'activities', labelKey: 'activities' },
  { slug: 'curiosidades', labelKey: 'curiosidades' },
  { slug: 'programs', labelKey: 'programs' },
  { slug: 'tours', labelKey: 'tours' },
]

onMounted(() => {
  const scrollHandler = () => { scrolled.value = window.scrollY > 60 }
  window.addEventListener('scroll', scrollHandler, { passive: true })

  const clickOutsideHandler = (e: MouseEvent | TouchEvent) => {
    if (newsDropdownRef.value && !newsDropdownRef.value.contains(e.target as Node)) {
      newsOpen.value = false
    }
  }
  document.addEventListener('click', clickOutsideHandler)
  document.addEventListener('touchstart', clickOutsideHandler)

  onUnmounted(() => {
    window.removeEventListener('scroll', scrollHandler)
    document.removeEventListener('click', clickOutsideHandler)
    document.removeEventListener('touchstart', clickOutsideHandler)
  })
})

const route = useRoute()
watch(() => route.path, () => {
  menuOpen.value = false
  newsOpen.value = false
})
</script>

<style scoped>
.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.15s ease;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
}
</style>
