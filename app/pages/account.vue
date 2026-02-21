<template>
  <div class="min-h-[calc(100vh-4rem)] py-20">
    <div class="container mx-auto px-4 lg:px-6">
      <div class="mx-auto max-w-lg">

        <!-- Profile card -->
        <div class="rounded-2xl border border-zinc-100 bg-white p-8 shadow-sm">
          <!-- Avatar -->
          <div class="mb-6 flex items-center gap-4">
            <div class="flex size-14 items-center justify-center rounded-full bg-iberia/10 text-xl font-bold text-iberia">
              {{ userInitial }}
            </div>
            <div>
              <h1 class="font-display text-xl font-bold text-zinc-900">{{ user?.username }}</h1>
              <p class="text-sm text-zinc-500">{{ user?.email }}</p>
            </div>
          </div>

          <div class="border-t border-zinc-100 pt-6">
            <dl class="space-y-4">
              <div>
                <dt class="text-xs font-medium uppercase tracking-wider text-zinc-400">{{ $t('auth.username') }}</dt>
                <dd class="mt-1 text-sm font-medium text-zinc-800">{{ user?.username }}</dd>
              </div>
              <div>
                <dt class="text-xs font-medium uppercase tracking-wider text-zinc-400">{{ $t('auth.email') }}</dt>
                <dd class="mt-1 text-sm font-medium text-zinc-800">{{ user?.email }}</dd>
              </div>
              <div>
                <dt class="text-xs font-medium uppercase tracking-wider text-zinc-400">{{ $t('auth.accountStatus') }}</dt>
                <dd class="mt-1">
                  <span
                    class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
                    :class="user?.confirmed ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'"
                  >
                    <span class="size-1.5 rounded-full" :class="user?.confirmed ? 'bg-green-500' : 'bg-yellow-500'" />
                    {{ user?.confirmed ? $t('auth.confirmed') : $t('auth.unconfirmed') }}
                  </span>
                </dd>
              </div>
            </dl>
          </div>

          <div class="mt-8 border-t border-zinc-100 pt-6">
            <button
              class="flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-200 px-4 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600"
              @click="handleLogout"
            >
              <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              {{ $t('auth.logout') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default',
  middleware: 'auth',
  headerSolid: true,
})

const localePath = useLocalePath()
const router = useRouter()
const { user, logout } = useAuth()

const userInitial = computed(() => user.value?.username?.charAt(0).toUpperCase() ?? '?')

function handleLogout() {
  logout()
  router.push(localePath('/'))
}
</script>
