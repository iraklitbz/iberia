<template>
  <header
    class="fixed inset-x-0 top-0 z-50 transition-all duration-300"
    :class="solid ? 'bg-white/95 shadow-sm backdrop-blur-sm' : 'border-b border-white/8 bg-zinc-900/30 backdrop-blur-xl'"
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
          :class="solid ? '' : 'brightness-0 invert'"
        />
        <img
          src="https://res.cloudinary.com/dj6draudd/image/upload/v1771671557/logo_iberia_text_1_9fda9ff279.svg"
          alt="Iberia"
          width="100"
          height="30"
          class="h-[30px] w-auto transition-all duration-300"
          :class="solid ? '' : 'brightness-0 invert'"
        />
      </NuxtLink>

      <!-- Desktop nav -->
      <nav class="font-display hidden items-center gap-1 lg:flex">
        <NuxtLink
          :to="localePath('/')"
          class="rounded-lg px-3 py-2 text-sm font-medium transition-colors"
          :class="solid ? 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900' : 'text-white hover:bg-white/10'"
          active-class="!text-iberia"
          exact
        >
          {{ $t('home') }}
        </NuxtLink>

        <!-- Dropdown Noticias -->
        <div ref="newsDropdownRef" class="relative">
          <button
            class="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
            :class="solid ? 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900' : 'text-white hover:bg-white/10'"
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
          :class="solid ? 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900' : 'text-white hover:bg-white/10'"
          active-class="!text-iberia"
        >
          {{ $t('aboutus') }}
        </NuxtLink>

        <NuxtLink
          :to="localePath('/service')"
          class="rounded-lg px-3 py-2 text-sm font-medium transition-colors"
          :class="solid ? 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900' : 'text-white hover:bg-white/10'"
          active-class="!text-iberia"
        >
          {{ $t('service') }}
        </NuxtLink>

        <NuxtLink
          :to="localePath('/contact')"
          class="ml-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
          :class="solid ? 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900' : 'text-white hover:bg-white/10'"
          active-class="!text-iberia"
        >
          {{ $t('contactus') }}
        </NuxtLink>
      </nav>

      <!-- Right side: auth + language + hamburger -->
      <div class="flex items-center gap-3">
        <!-- Auth: desktop -->
        <div class="hidden items-center lg:flex">
          <!-- Skeleton mientras se resuelve el estado de auth -->
          <div v-if="!authReady" class="h-8 w-16 animate-pulse rounded-lg bg-zinc-200" />

          <!-- Not authenticated -->
          <NuxtLink
            v-else-if="!isAuthenticated"
            :to="localePath('/login')"
            class="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-all"
            :class="solid
              ? 'border-zinc-200 text-zinc-700 hover:border-iberia hover:text-iberia'
              : 'border-white/30 text-white hover:border-white hover:bg-white/10'"
          >
            <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
            </svg>
            Login
          </NuxtLink>

          <!-- Authenticated: user dropdown -->
          <div v-else ref="userDropdownRef" class="relative">
            <button
              class="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
              :class="solid ? 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900' : 'text-white hover:bg-white/10'"
              @click="userMenuOpen = !userMenuOpen"
            >
              <span class="flex size-7 items-center justify-center rounded-full bg-iberia text-xs font-bold text-white">
                {{ userInitial }}
              </span>
              <span>{{ user?.username }}</span>
              <svg
                class="size-3.5 transition-transform duration-200"
                :class="userMenuOpen ? 'rotate-180' : ''"
                viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"
              >
                <path d="M6 9l6 6 6-6"/>
              </svg>
            </button>

            <Transition name="dropdown">
              <div
                v-if="userMenuOpen"
                class="absolute right-0 top-full z-50 mt-2 w-44 rounded-xl border border-zinc-100 bg-white p-1.5 shadow-lg shadow-zinc-200/60"
              >
                <NuxtLink
                  :to="localePath('/account')"
                  class="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-600 transition-colors hover:bg-zinc-50 hover:text-zinc-900"
                  @click="userMenuOpen = false"
                >
                  <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                  </svg>
                  {{ $t('auth.myAccount') }}
                </NuxtLink>
                <hr class="my-1 border-zinc-100" />
                <button
                  class="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-500 transition-colors hover:bg-red-50"
                  @click="handleLogout"
                >
                  <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                  {{ $t('auth.logout') }}
                </button>
              </div>
            </Transition>
          </div>
        </div>

        <AppLanguage class="hidden sm:flex" :dark="!solid" />

        <button
          class="flex size-9 items-center justify-center rounded-lg transition-colors lg:hidden"
          :class="solid ? 'text-zinc-600 hover:bg-zinc-100' : 'text-white hover:bg-white/10'"
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

          <!-- Auth mobile -->
          <div class="border-t border-zinc-100 pt-3">
            <NuxtLink
              v-if="!isAuthenticated"
              :to="localePath('/login')"
              class="block rounded-lg px-3 py-2.5 text-sm font-medium text-iberia transition-colors hover:bg-iberia/5"
              @click="menuOpen = false"
            >
              {{ $t('auth.login') }}
            </NuxtLink>
            <template v-else>
              <NuxtLink
                :to="localePath('/account')"
                class="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
                @click="menuOpen = false"
              >
                <span class="flex size-6 items-center justify-center rounded-full bg-iberia text-xs font-bold text-white">
                  {{ userInitial }}
                </span>
                {{ user?.username }}
              </NuxtLink>
              <button
                class="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-red-500 transition-colors hover:bg-red-50"
                @click="handleLogout"
              >
                {{ $t('auth.logout') }}
              </button>
            </template>
          </div>

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
const router = useRouter()
const route = useRoute()
const { user, isAuthenticated, logout, authReady } = useAuth()

const scrolled = ref(false)
const solid = computed(() => scrolled.value || !!route.meta.headerSolid)
const menuOpen = ref(false)
const newsOpen = ref(false)
const userMenuOpen = ref(false)
const newsDropdownRef = ref<HTMLElement | null>(null)
const userDropdownRef = ref<HTMLElement | null>(null)

const userInitial = computed(() => user.value?.username?.charAt(0).toUpperCase() ?? '?')

const newsCategories = [
  { slug: 'news', labelKey: 'news' },
  { slug: 'events', labelKey: 'events' },
  { slug: 'activities', labelKey: 'activities' },
  { slug: 'curiosidades', labelKey: 'curiosidades' },
  { slug: 'programs', labelKey: 'programs' },
  { slug: 'tours', labelKey: 'tours' },
]

function handleLogout() {
  logout()
  userMenuOpen.value = false
  menuOpen.value = false
  router.push(localePath('/'))
}

onMounted(() => {
  const scrollHandler = () => { scrolled.value = window.scrollY > 60 }
  window.addEventListener('scroll', scrollHandler, { passive: true })

  const clickOutsideHandler = (e: MouseEvent | TouchEvent) => {
    if (newsDropdownRef.value && !newsDropdownRef.value.contains(e.target as Node)) {
      newsOpen.value = false
    }
    if (userDropdownRef.value && !userDropdownRef.value.contains(e.target as Node)) {
      userMenuOpen.value = false
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

watch(() => route.path, () => {
  menuOpen.value = false
  newsOpen.value = false
  userMenuOpen.value = false
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
