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
              class="absolute left-1/2 top-full z-50 mt-4 w-[48rem] -translate-x-[28%] rounded-lg border border-zinc-100 bg-white p-7 shadow-2xl shadow-zinc-200/70"
            >
              <span class="absolute -top-2 left-[9.75rem] size-4 rotate-45 border-l border-t border-zinc-100 bg-white" />

              <NuxtLink
                :to="localePath({ name: 'category-slug', params: { slug: 'news' } })"
                class="group flex items-center gap-7 rounded-lg transition-colors hover:bg-zinc-50"
                @click="newsOpen = false"
              >
                <div class="flex size-20 shrink-0 items-center justify-center rounded-full bg-iberia/10 text-iberia">
                  <svg class="size-10" viewBox="0 0 64 64" fill="currentColor" aria-hidden="true">
                    <path d="M26.4 8.8c3.2 19.1 12.3 28.2 31.4 31.4-19.1 3.2-28.2 12.3-31.4 31.4C23.2 52.5 14.1 43.4-5 40.2c19.1-3.2 28.2-12.3 31.4-31.4Z" />
                    <path d="M47.8 6.5c1.5 8.7 5.6 12.8 14.3 14.3-8.7 1.5-12.8 5.6-14.3 14.3-1.5-8.7-5.6-12.8-14.3-14.3 8.7-1.5 12.8-5.6 14.3-14.3Z" />
                  </svg>
                </div>
                <div>
                  <p class="text-3xl font-semibold leading-tight text-zinc-950">{{ $t('news') }}</p>
                  <p class="mt-2 max-w-sm text-sm leading-6 text-zinc-500">{{ newsMenuSubtitle }}</p>
                </div>
              </NuxtLink>

              <div class="my-7 h-px bg-zinc-100" />

              <div class="grid grid-cols-3 gap-4">
                <NuxtLink
                  v-for="cat in newsCategories"
                  :key="cat.slug"
                  :to="localePath({ name: 'category-slug', params: { slug: cat.slug } })"
                  class="group flex min-h-40 flex-col rounded-lg border border-zinc-100 bg-white p-4 shadow-sm shadow-zinc-100/70 transition-all hover:-translate-y-0.5 hover:border-iberia/20 hover:shadow-lg hover:shadow-zinc-200/70"
                  active-class="border-iberia/30 bg-iberia/5"
                  @click="newsOpen = false"
                >
                  <span
                    class="mb-5 flex size-14 items-center justify-center rounded-full"
                    :class="cat.iconBg"
                  >
                    <svg class="size-7" :class="cat.iconColor" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                      <template v-if="cat.icon === 'calendar'">
                        <path d="M8 2v4" />
                        <path d="M16 2v4" />
                        <rect x="3" y="5" width="18" height="16" rx="2" />
                        <path d="M3 10h18" />
                      </template>
                      <template v-else-if="cat.icon === 'list'">
                        <path d="M8 6h11" />
                        <path d="M8 12h11" />
                        <path d="M8 18h11" />
                        <path d="M4 6h.01" />
                        <path d="M4 12h.01" />
                        <path d="M4 18h.01" />
                      </template>
                      <template v-else-if="cat.icon === 'bulb'">
                        <path d="M12 2v2.2" />
                        <path d="m4.9 4.9 1.6 1.6" />
                        <path d="m19.1 4.9-1.6 1.6" />
                        <path d="M2 12h2.3" />
                        <path d="M19.7 12H22" />
                        <path d="m4.9 19.1 1.6-1.6" />
                        <path d="m19.1 19.1-1.6-1.6" />
                        <path d="M8.5 13.9a5.2 5.2 0 1 1 7 0c-.9.8-1.5 1.7-1.5 3.1h-4c0-1.4-.6-2.3-1.5-3.1Z" />
                        <path d="M9.8 20h4.4" />
                        <path d="M10.4 22h3.2" />
                      </template>
                      <template v-else-if="cat.icon === 'book'">
                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H21" />
                        <path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H21v20H6.5A2.5 2.5 0 0 1 4 19.5Z" />
                        <path d="M8 6h9" />
                        <path d="M8 10h8" />
                      </template>
                      <template v-else-if="cat.icon === 'map'">
                        <path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3V6Z" />
                        <path d="M9 3v15" />
                        <path d="M15 6v15" />
                      </template>
                      <template v-else-if="cat.icon === 'help'">
                        <path d="M9.5 9a2.7 2.7 0 1 1 4.8 1.7c-.9.8-1.8 1.4-1.8 2.8" />
                        <path d="M12 17h.01" />
                        <circle cx="12" cy="12" r="9" />
                      </template>
                      <template v-else-if="cat.icon === 'hash'">
                        <path
                          fill="currentColor"
                          stroke="none"
                          transform="translate(1.5 0) scale(0.046875)"
                          d="M440.7 182.1l7.1-40C449.1 134.8 443.5 128 436 128h-74.9l14.6-81.9C377.1 38.8 371.4 32 363.9 32h-40.6c-5.8 0-10.8 4.1-11.8 9.9L296.1 128h-98.6l14.6-81.9C213.5 38.8 207.8 32 200.4 32h-40.6c-5.8 0-10.8 4.1-11.8 9.9L132.5 128H53.4c-5.8 0-10.8 4.1-11.8 9.9l-7.1 40C33.2 185.2 38.8 192 46.3 192h74.9L98.3 320H19.2c-5.8 0-10.8 4.1-11.8 9.9l-7.1 40C-1.1 377.2 4.6 384 12.1 384h74.9l-14.6 81.9C71 473.2 76.7 480 84.1 480h40.6c5.8 0 10.8-4.1 11.8-9.9L151.9 384h98.6l-14.6 81.9c-1.3 7.3 4.3 14.1 11.8 14.1h40.6c5.8 0 10.8-4.1 11.8-9.9L315.5 384h79.1c5.8 0 10.8-4.1 11.8-9.9l7.1-40c1.3-7.3-4.3-14.1-11.8-14.1h-74.9l22.9-128h79.1c5.8 0 10.8-4.1 11.9-9.9zM261.9 320h-98.6l22.9-128h98.6l-22.9 128z"
                        />
                      </template>
                      <template v-else>
                        <path d="M12 3v18" />
                        <path d="M5 8h14" />
                        <path d="M5 16h14" />
                        <path d="m8 3 2 18" />
                        <path d="m16 3-2 18" />
                      </template>
                    </svg>
                  </span>

                  <span class="text-sm font-semibold leading-5 text-zinc-950">{{ $t(cat.labelKey) }}</span>
                  <span class="mt-2 line-clamp-2 text-xs leading-5 text-zinc-500">{{ cat.description }}</span>
                  <span class="mt-auto self-end pt-4 text-lg leading-none text-iberia transition-transform group-hover:translate-x-1">-></span>
                </NuxtLink>
              </div>
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

        <a
          :href="localePath('/forum')"
          class="rounded-lg px-3 py-2 text-sm font-medium transition-colors"
          :class="solid ? 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900' : 'text-white hover:bg-white/10'"
        >
          {{ $t('forum.title') }}
        </a>
      </nav>

      <!-- Right side: auth + language + hamburger -->
      <div class="flex items-center gap-3">
        <NuxtLink
          :to="localePath('/i')"
          class="hidden size-10 items-center justify-center overflow-visible transition-opacity hover:opacity-80 lg:flex"
          aria-label="I"
        >
          <span class="relative block size-10 shrink-0 max-w-none">
            <img
              :src="foxLogoUrl"
              alt="I"
              width="40"
              height="40"
              class="size-10 max-w-none object-contain mix-blend-multiply"
            />
            <span
              v-if="isIPage"
              class="absolute inset-0 bg-[#E35335] mix-blend-screen"
              aria-hidden="true"
            />
          </span>
        </NuxtLink>

        <ClientOnly>
          <div ref="notificationsDropdownRef" class="relative hidden lg:block">
            <button
              type="button"
              class="relative flex size-10 items-center justify-center rounded-full transition-colors"
              :class="solid ? 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900' : 'text-white hover:bg-white/10'"
              :aria-label="notificationLabel"
              @click="toggleNotifications"
            >
              <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              <span
                v-if="unreadPostCount"
                class="absolute -right-1 -top-1 flex min-w-5 items-center justify-center rounded-full bg-iberia px-1.5 text-[11px] font-bold leading-5 text-white ring-2 ring-white"
              >
                {{ unreadPostCount > 9 ? '9+' : unreadPostCount }}
              </span>
            </button>

            <Transition name="dropdown">
              <div
                v-if="notificationsOpen"
                class="absolute right-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-xl border border-zinc-100 bg-white shadow-lg shadow-zinc-200/60"
              >
                <div class="flex items-center justify-between border-b border-zinc-100 px-4 py-3">
                  <p class="text-sm font-bold text-zinc-950">{{ t('notifications.title') }}</p>
                  <span v-if="unreadPostCount" class="rounded-full bg-iberia/10 px-2 py-0.5 text-xs font-bold text-iberia">
                    {{ unreadPostCount }}
                  </span>
                </div>

                <div v-if="latestNotifications.length" class="max-h-96 overflow-y-auto py-1">
                  <NuxtLink
                    v-for="post in latestNotifications"
                    :key="post.id"
                    :to="post.href"
                    class="flex gap-3 px-4 py-3 transition hover:bg-zinc-50"
                    @click="handleNotificationClick"
                  >
                    <span class="mt-1 flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-iberia/10 text-sm font-bold text-iberia">
                      <img
                        v-if="post.image"
                        :src="post.image"
                        :alt="post.title"
                        class="size-full object-cover"
                        loading="lazy"
                      />
                      <span v-else>{{ post.initial || 'I' }}</span>
                    </span>
                    <span class="min-w-0 flex-1">
                      <span class="block truncate text-sm font-semibold text-zinc-950">
                        {{ post.title }}
                      </span>
                      <span class="mt-0.5 line-clamp-2 text-xs leading-5 text-zinc-500">
                        {{ post.message || (post.type === 'web' ? t('notifications.webPost') : t('forum.title')) }}
                      </span>
                      <span class="mt-1 block text-[11px] font-medium text-zinc-400">
                        {{ formatNotificationDate(post.date) }}
                      </span>
                    </span>
                    <span v-if="isUnreadNotification(post)" class="mt-2 size-2 shrink-0 rounded-full bg-iberia" />
                  </NuxtLink>
                </div>

                <div v-else class="px-4 py-6 text-center text-sm text-zinc-500">
                  {{ notificationsLoading ? t('loading') : t('notifications.empty') }}
                </div>

                <NuxtLink
                  :to="localePath('/forum')"
                  class="block border-t border-zinc-100 px-4 py-3 text-center text-sm font-semibold text-iberia transition hover:bg-iberia/5"
                  @click="handleNotificationClick"
                >
                  {{ t('notifications.viewForum') }}
                </NuxtLink>
              </div>
            </Transition>
          </div>
        </ClientOnly>

        <!-- Auth: desktop -->
        <ClientOnly>
          <div class="hidden items-center gap-2 lg:flex">
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
            <template v-else>
              <div ref="userDropdownRef" class="relative">
                <button
                  class="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
                  :class="solid ? 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900' : 'text-white hover:bg-white/10'"
                  @click="userMenuOpen = !userMenuOpen"
                >
                  <img
                    v-if="profileAvatar"
                    :src="profileAvatar"
                    :alt="user?.username ?? ''"
                    class="size-7 rounded-full object-cover ring-1 ring-zinc-200"
                  />
                  <span v-else class="flex size-7 items-center justify-center rounded-full bg-iberia text-xs font-bold text-white">
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
            </template>
          </div>
          <template #fallback>
            <div class="hidden items-center lg:flex">
              <div class="h-8 w-16 animate-pulse rounded-lg bg-zinc-200" />
            </div>
          </template>
        </ClientOnly>

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

          <a
            :href="localePath('/forum')"
            class="block rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
            @click="menuOpen = false"
          >
            {{ $t('forum.title') }}
          </a>

          <NuxtLink
            :to="localePath('/i')"
            class="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
            active-class="text-[#E35335]"
            @click="menuOpen = false"
          >
            <span class="relative block size-5">
              <img
                :src="foxLogoUrl"
                alt=""
                width="20"
                height="20"
                class="size-full object-contain mix-blend-multiply"
              />
              <span
                v-if="isIPage"
                class="absolute inset-0 bg-[#E35335] mix-blend-screen"
                aria-hidden="true"
              />
            </span>
            I
          </NuxtLink>

          <NuxtLink
            :to="mobileNotificationHref"
            class="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
            @click="handleMobileNotificationsClick"
          >
            <span class="flex items-center gap-2">
              <svg class="size-5 text-zinc-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              {{ t('notifications.title') }}
            </span>
            <span
              v-if="unreadPostCount"
              class="rounded-full bg-iberia px-2 py-0.5 text-xs font-bold text-white"
            >
              {{ unreadPostCount > 9 ? '9+' : unreadPostCount }}
            </span>
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
                <img
                  v-if="profileAvatar"
                  :src="profileAvatar"
                  :alt="user?.username ?? ''"
                  class="size-6 rounded-full object-cover ring-1 ring-zinc-200"
                />
                <span v-else class="flex size-6 items-center justify-center rounded-full bg-iberia text-xs font-bold text-white">
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
type HeaderForumPost = {
  id: string
  name?: string
  initial?: string
  title?: string
  section?: string
  message?: string
  createdAt: string
}

type HeaderWebPost = {
  id: string
  slug: string
  title: string
  excerpt: string
  date: string
  image: string | null
  localeCode: 'es' | 'ge'
}

type HeaderNotification = {
  id: string
  type: 'web' | 'forum'
  title: string
  message: string
  date: string
  href: string
  image?: string | null
  initial?: string
}

const localePath = useLocalePath()
const router = useRouter()
const route = useRoute()
const { user, isAuthenticated, logout, authReady, userInitial, profileAvatar } = useAuth()
const { t, locale } = useI18n()

const solid = true
const menuOpen = ref(false)
const newsOpen = ref(false)
const userMenuOpen = ref(false)
const notificationsOpen = ref(false)
const notificationsLoading = ref(false)
const forumPosts = ref<HeaderForumPost[]>([])
const webPosts = ref<HeaderWebPost[]>([])
const lastSeenPostAt = ref<string | null>(null)
const seenNotificationIds = ref<string[]>([])
const newsDropdownRef = ref<HTMLElement | null>(null)
const userDropdownRef = ref<HTMLElement | null>(null)
const notificationsDropdownRef = ref<HTMLElement | null>(null)
let notificationsTimer: ReturnType<typeof setInterval> | null = null
const foxLogoUrl = 'https://res.cloudinary.com/dj6draudd/image/upload/v1791556893/Minimalist_Black_Fox_Emblem_2_ed049131ba.png'

const newsMenuSubtitle = computed(() => {
  return locale.value === 'es'
    ? 'Actualidad, eventos y novedades de Iberia.'
    : 'ჩვენ შესახებ სიახლეები, ღონისძიებები და ამბები.'
})

const newsCategories = computed(() => [
  {
    slug: 'events',
    labelKey: 'events',
    description: locale.value === 'es' ? 'Encuentros, fechas y actividades.' : 'შეხვედრები, თარიღები და აქტივობები.',
    icon: 'calendar',
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-500',
  },
  {
    slug: 'activities',
    labelKey: 'activities',
    description: locale.value === 'es' ? 'Proyectos e iniciativas del centro.' : 'ცენტრის პროექტები და ინიციატივები.',
    icon: 'hash',
    iconBg: 'bg-fuchsia-50',
    iconColor: 'text-fuchsia-600',
  },
  {
    slug: 'curiosidades',
    labelKey: 'curiosidades',
    description: locale.value === 'es' ? 'Historias y datos interesantes.' : 'საინტერესო ისტორიები და ფაქტები.',
    icon: 'bulb',
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-500',
  },
  {
    slug: 'programs',
    labelKey: 'programs',
    description: locale.value === 'es' ? 'Programas educativos y culturales.' : 'სასწავლო და კულტურული პროგრამები.',
    icon: 'book',
    iconBg: 'bg-orange-50',
    iconColor: 'text-orange-500',
  },
  {
    slug: 'tours',
    labelKey: 'tours',
    description: locale.value === 'es' ? 'Guías y viajes por España.' : 'გიდები და მოგზაურობა ესპანეთში.',
    icon: 'map',
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
  },
  {
    slug: 'icodit-rom',
    labelKey: 'didYouKnow',
    description: locale.value === 'es' ? 'Notas breves para descubrir más.' : 'მოკლე ცნობები მეტის გასაგებად.',
    icon: 'help',
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
  },
])

const sortedForumPosts = computed(() => {
  return [...forumPosts.value].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })
})
const webNotifications = computed<HeaderNotification[]>(() => {
  return webPosts.value.filter(post => post.slug).map((post) => ({
    id: `web:${post.id}`,
    type: 'web',
    title: post.title || t('notifications.untitledPost'),
    message: cleanNotificationText(post.excerpt),
    date: post.date,
    href: localePath(`/news/${encodeURIComponent(post.slug)}`, post.localeCode),
    image: post.image,
  }))
})
const forumNotifications = computed<HeaderNotification[]>(() => {
  return forumPosts.value.map((post) => ({
    id: `forum:${post.id}`,
    type: 'forum',
    title: post.title || t('notifications.untitledPost'),
    message: post.message ?? '',
    date: post.createdAt,
    href: localePath({
      path: '/forum',
      query: post.section && post.section !== 'forum' ? { section: post.section } : undefined,
    }),
    initial: post.initial || post.name?.charAt(0)?.toUpperCase() || '?',
  }))
})
const sortedNotifications = computed(() => {
  return [...webNotifications.value, ...forumNotifications.value].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })
})
const latestNotifications = computed(() => {
  const pinned = [
    ...webNotifications.value.slice(0, 5),
    ...forumNotifications.value.slice(0, 5),
  ]
  const unique = new Map<string, HeaderNotification>()

  for (const post of [...sortedNotifications.value.filter(isUnreadNotification), ...pinned, ...sortedNotifications.value]) {
    unique.set(post.id, post)
    if (unique.size >= 12) {
      break
    }
  }

  return [...unique.values()].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })
})
const unreadPostCount = computed(() => sortedNotifications.value.filter(isUnreadNotification).length)
const mobileNotificationHref = computed(() => latestNotifications.value[0]?.href ?? localePath({ name: 'category-slug', params: { slug: 'news' } }))
const notificationLabel = computed(() => {
  return unreadPostCount.value
    ? t('notifications.ariaWithCount', { count: unreadPostCount.value })
    : t('notifications.aria')
})
const isIPage = computed(() => route.path.split('/').filter(Boolean).at(-1) === 'i')

function handleLogout() {
  logout()
  userMenuOpen.value = false
  notificationsOpen.value = false
  menuOpen.value = false
  router.push(localePath('/'))
}

function currentNotificationKey() {
  const identity = user.value?.id ?? user.value?.email ?? user.value?.username ?? 'guest'
  return `iberia-seen-post-notifications:${identity}:${locale.value}`
}

function currentSeenIdsKey() {
  const identity = user.value?.id ?? user.value?.email ?? user.value?.username ?? 'guest'
  return `iberia-seen-post-notification-ids:${identity}`
}

function newestNotificationDate() {
  return sortedNotifications.value[0]?.date ?? new Date().toISOString()
}

function loadLastSeenPostAt() {
  const storageKey = currentNotificationKey()
  const stored = localStorage.getItem(storageKey)

  if (stored) {
    lastSeenPostAt.value = stored
    return
  }

  lastSeenPostAt.value = newestNotificationDate()
  saveLastSeenPostAt()
}

function loadSeenNotificationIds() {
  try {
    const stored = localStorage.getItem(currentSeenIdsKey())
    if (stored) {
      seenNotificationIds.value = JSON.parse(stored)
      return
    }
  }
  catch {
    seenNotificationIds.value = []
  }

  seenNotificationIds.value = sortedNotifications.value.map(post => post.id)
  saveSeenNotificationIds()
}

function saveSeenNotificationIds() {
  localStorage.setItem(currentSeenIdsKey(), JSON.stringify(seenNotificationIds.value))
}

function saveLastSeenPostAt() {
  if (!lastSeenPostAt.value) {
    return
  }
  localStorage.setItem(currentNotificationKey(), lastSeenPostAt.value)
}

function markNotificationsSeen() {
  lastSeenPostAt.value = newestNotificationDate()
  seenNotificationIds.value = sortedNotifications.value.map(post => post.id)
  saveLastSeenPostAt()
  saveSeenNotificationIds()
}

function isUnreadNotification(item: HeaderNotification) {
  if (!seenNotificationIds.value.length) {
    if (!lastSeenPostAt.value) {
      return false
    }

    return new Date(item.date).getTime() > new Date(lastSeenPostAt.value).getTime()
  }

  return !seenNotificationIds.value.includes(item.id)
}

async function fetchForumNotifications() {
  try {
    forumPosts.value = await $fetch<HeaderForumPost[]>('/api/forum/posts')
  }
  catch {
    forumPosts.value = []
  }
}

async function fetchWebNotifications() {
  try {
    webPosts.value = await $fetch<HeaderWebPost[]>('/api/notifications/posts')
  }
  catch {
    webPosts.value = []
  }
}

async function fetchNotifications() {
  if (notificationsLoading.value) {
    return
  }

  notificationsLoading.value = true
  try {
    await Promise.all([
      fetchWebNotifications(),
      fetchForumNotifications(),
    ])
    if (!lastSeenPostAt.value) {
      loadLastSeenPostAt()
    }
    if (!seenNotificationIds.value.length) {
      loadSeenNotificationIds()
    }
  }
  catch {
    webPosts.value = []
    forumPosts.value = []
  }
  finally {
    notificationsLoading.value = false
  }
}

async function refreshNotificationsForCurrentIdentity() {
  lastSeenPostAt.value = null
  seenNotificationIds.value = []
  await fetchNotifications()
}

function startNotificationsTimer() {
  if (!notificationsTimer) {
    notificationsTimer = setInterval(fetchNotifications, 30000)
  }
}

function toggleNotifications() {
  notificationsOpen.value = !notificationsOpen.value
  userMenuOpen.value = false

  if (notificationsOpen.value) {
    markNotificationsSeen()
  }
}

function handleNotificationClick() {
  markNotificationsSeen()
  notificationsOpen.value = false
}

function handleMobileNotificationsClick() {
  markNotificationsSeen()
  menuOpen.value = false
}

function formatNotificationDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return ''
  }

  return new Intl.DateTimeFormat(undefined, {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

function cleanNotificationText(value: string) {
  return value.replace(/<[^>]+>/g, '').trim()
}

onMounted(() => {
  const clickOutsideHandler = (e: MouseEvent | TouchEvent) => {
    if (newsDropdownRef.value && !newsDropdownRef.value.contains(e.target as Node)) {
      newsOpen.value = false
    }
    if (userDropdownRef.value && !userDropdownRef.value.contains(e.target as Node)) {
      userMenuOpen.value = false
    }
    if (notificationsDropdownRef.value && !notificationsDropdownRef.value.contains(e.target as Node)) {
      notificationsOpen.value = false
    }
  }
  document.addEventListener('click', clickOutsideHandler)
  document.addEventListener('touchstart', clickOutsideHandler)

  onUnmounted(() => {
    document.removeEventListener('click', clickOutsideHandler)
    document.removeEventListener('touchstart', clickOutsideHandler)
    if (notificationsTimer) {
      clearInterval(notificationsTimer)
    }
  })

  void refreshNotificationsForCurrentIdentity()
  startNotificationsTimer()
})

watch([authReady, isAuthenticated], async () => {
  if (!import.meta.client) {
    return
  }

  if (!authReady.value) {
    return
  }

  await refreshNotificationsForCurrentIdentity()
  startNotificationsTimer()
}, { immediate: true })

watch(locale, async () => {
  if (!import.meta.client) {
    return
  }

  await refreshNotificationsForCurrentIdentity()
})

watch(() => route.path, () => {
  menuOpen.value = false
  newsOpen.value = false
  userMenuOpen.value = false
  notificationsOpen.value = false
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
