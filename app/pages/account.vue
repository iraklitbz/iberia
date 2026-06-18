<template>
  <div class="min-h-[calc(100vh-4rem)] py-20">
    <div class="container mx-auto px-4 lg:px-6">
      <div class="mx-auto max-w-lg">

        <!-- Profile card -->
        <div class="rounded-2xl border border-zinc-100 bg-white p-8 shadow-sm">
          <div class="mb-6 flex items-center gap-4">
            <div class="relative size-16 shrink-0">
              <img
                v-if="profileAvatar"
                :src="profileAvatar"
                :alt="user?.username ?? ''"
                class="size-16 rounded-full object-cover ring-1 ring-zinc-200"
              />
              <div
                v-else
                class="flex size-16 items-center justify-center rounded-full bg-iberia/10 text-xl font-bold text-iberia"
              >
                {{ userInitial }}
              </div>
            </div>
            <div>
              <h1 class="font-display text-xl font-bold text-zinc-900">{{ user?.username }}</h1>
              <p class="text-sm text-zinc-500">{{ user?.email }}</p>
            </div>
          </div>

          <div class="border-t border-zinc-100 pt-6">
            <div class="mb-6 rounded-xl bg-zinc-50 p-4">
              <form class="grid gap-4" @submit.prevent="handleSaveName">
                <div>
                  <label class="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-400">
                    {{ $t('auth.displayName') }}
                  </label>
                  <input
                    v-model.trim="form.username"
                    type="text"
                    maxlength="40"
                    class="h-11 w-full rounded-xl border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-800 outline-none transition focus:border-iberia focus:ring-2 focus:ring-iberia/10"
                    :placeholder="$t('auth.usernamePlaceholder')"
                  />
                </div>

                <div>
                  <p class="mb-2 text-xs font-medium uppercase tracking-wider text-zinc-400">
                    {{ $t('auth.profilePicture') }}
                  </p>
                  <div class="flex flex-wrap gap-2">
                    <label class="inline-flex cursor-pointer items-center justify-center rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:border-iberia hover:text-iberia">
                      {{ $t('auth.changePicture') }}
                      <input
                        ref="avatarInput"
                        type="file"
                        accept="image/*"
                        class="sr-only"
                        @change="handleAvatarUpload"
                      />
                    </label>
                    <button
                      v-if="profileAvatar"
                      type="button"
                      class="rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-red-500 transition-colors hover:border-red-200 hover:bg-red-50"
                      @click="handleRemoveAvatar"
                    >
                      {{ $t('auth.removePicture') }}
                    </button>
                  </div>
                </div>

                <p v-if="message" class="text-sm" :class="messageType === 'success' ? 'text-green-600' : 'text-red-600'">
                  {{ message }}
                </p>

                <button
                  type="submit"
                  class="inline-flex h-11 items-center justify-center rounded-xl bg-iberia px-5 text-sm font-semibold text-white transition-colors hover:bg-iberia-dark disabled:cursor-not-allowed disabled:opacity-60"
                  :disabled="saving || !form.username"
                >
                  {{ saving ? $t('auth.saving') : $t('auth.saveChanges') }}
                </button>
              </form>
            </div>

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
                <dt class="text-xs font-medium uppercase tracking-wider text-zinc-400">{{ $t('auth.membershipType') }}</dt>
                <dd class="mt-1">
                  <span
                    class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
                    :class="isSubscriber ? 'bg-amber-50 text-amber-700' : 'bg-iberia/8 text-iberia'"
                  >
                    <svg v-if="isSubscriber" class="size-3" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    <span v-else class="size-1.5 rounded-full bg-iberia" />
                    {{ isSubscriber ? $t('auth.memberTypeSubscriber') : $t('auth.memberTypeMember') }}
                  </span>
                </dd>
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
const { t } = useI18n()
const {
  user,
  logout,
  isSubscriber,
  userInitial,
  profileAvatar,
  saveProfileAvatar,
  updateUsername,
} = useAuth()

const avatarInput = ref<HTMLInputElement | null>(null)
const form = reactive({ username: '' })
const saving = ref(false)
const message = ref('')
const messageType = ref<'success' | 'error'>('success')

watch(
  user,
  value => {
    form.username = value?.username ?? ''
  },
  { immediate: true },
)

function handleLogout() {
  logout()
  router.push(localePath('/'))
}

function setMessage(type: 'success' | 'error', text: string) {
  messageType.value = type
  message.value = text
}

async function handleSaveName() {
  if (!form.username) return

  saving.value = true
  message.value = ''

  try {
    await updateUsername(form.username)
    setMessage('success', t('auth.profileSaved'))
  }
  catch {
    setMessage('error', t('auth.profileSaveError'))
  }
  finally {
    saving.value = false
  }
}

function handleAvatarUpload(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  if (!file.type.startsWith('image/')) {
    setMessage('error', t('auth.imageOnly'))
    input.value = ''
    return
  }

  if (file.size > 2 * 1024 * 1024) {
    setMessage('error', t('auth.imageTooLarge'))
    input.value = ''
    return
  }

  const reader = new FileReader()
  reader.onload = () => {
    saveProfileAvatar(typeof reader.result === 'string' ? reader.result : null)
    setMessage('success', t('auth.profileSaved'))
  }
  reader.onerror = () => setMessage('error', t('auth.profileSaveError'))
  reader.readAsDataURL(file)
  input.value = ''
}

function handleRemoveAvatar() {
  saveProfileAvatar(null)
  if (avatarInput.value) avatarInput.value.value = ''
  setMessage('success', t('auth.profileSaved'))
}
</script>
