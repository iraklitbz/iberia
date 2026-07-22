<template>
  <div class="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-[#f1f2f5] pt-16">
    <div class="pointer-events-none absolute inset-0">
      <img
        src="https://res.cloudinary.com/dj6draudd/image/upload/v1784759805/Chat_GPT_Image_Jul_23_2026_12_33_37_AM_5cf8abdd7e.png"
        alt=""
        class="absolute -top-[14%] left-0 h-[114%] w-[126%] object-fill opacity-72 grayscale-[15%] saturate-150 contrast-115 mix-blend-multiply"
      />
      <div class="absolute inset-0 bg-[#dde1e7]/42" />
      <div class="absolute inset-0 bg-gradient-to-b from-[#dde1e7]/72 via-[#e6e8ed]/22 to-[#e6e8ed]/84" />
      <div class="absolute inset-0 bg-black/18" />
    </div>

    <main class="relative mx-auto w-full max-w-[92rem] px-4 py-10 sm:px-6 lg:px-8">
      <section class="account-shell">
        <div class="relative overflow-hidden rounded-[1.65rem] bg-white/74 p-6 shadow-[0_24px_80px_rgb(15_23_42/0.08)] ring-1 ring-zinc-200/70 backdrop-blur md:p-10">
          <div class="absolute inset-0 bg-[radial-gradient(circle_at_85%_14%,rgba(232,70,113,0.17),transparent_26%),radial-gradient(circle_at_56%_34%,rgba(248,198,204,0.28),transparent_31%)]" />
          <div class="absolute -right-24 -top-20 size-[26rem] rounded-full border border-white/60 opacity-70" />
          <div class="absolute -right-12 top-8 size-[19rem] rounded-full border border-white/55 opacity-70" />

          <div class="relative flex flex-col gap-6 sm:flex-row sm:items-center">
            <div class="relative size-28 shrink-0 sm:size-36">
              <img
                v-if="profileAvatar"
                :src="profileAvatar"
                :alt="user?.username ?? ''"
                class="size-full rounded-full border-4 border-white object-cover shadow-xl ring-1 ring-zinc-200"
              />
              <div
                v-else
                class="flex size-full items-center justify-center rounded-full border-4 border-white bg-iberia text-4xl font-bold text-white shadow-xl ring-1 ring-zinc-200"
              >
                {{ userInitial }}
              </div>
              <label
                class="absolute bottom-0 right-0 flex size-12 cursor-pointer items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-600 shadow-lg transition hover:border-iberia hover:text-iberia"
                :title="$t('auth.changePicture')"
                :aria-label="$t('auth.changePicture')"
              >
                <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3Z"/>
                  <circle cx="12" cy="13" r="3"/>
                </svg>
                <input
                  ref="avatarInput"
                  type="file"
                  accept="image/*"
                  class="sr-only"
                  :disabled="avatarSaving"
                  @change="handleAvatarUpload"
                />
              </label>
            </div>

            <div class="min-w-0">
              <div class="flex flex-wrap items-center gap-3">
                <h1 class="font-display text-3xl font-bold text-slate-950 sm:text-4xl">{{ user?.username }}</h1>
                <span
                  class="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700"
                  :class="user?.confirmed ? 'bg-emerald-100 text-emerald-700' : 'bg-yellow-100 text-yellow-700'"
                >
                  <span class="size-2 rounded-full" :class="user?.confirmed ? 'bg-emerald-500' : 'bg-yellow-500'" />
                  {{ user?.confirmed ? $t('auth.confirmed') : $t('auth.unconfirmed') }}
                </span>
              </div>
              <p class="mt-3 text-lg font-medium text-slate-500">{{ user?.email }}</p>
              <span
                class="mt-5 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold"
                :class="isSubscriber ? 'bg-amber-100 text-amber-700' : 'bg-iberia/10 text-iberia'"
              >
                <svg v-if="isSubscriber" class="size-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                <span v-else class="size-2 rounded-full bg-iberia" />
                {{ isSubscriber ? $t('auth.memberTypeSubscriber') : $t('auth.memberTypeMember') }}
              </span>
            </div>
          </div>
        </div>

        <form class="mt-2 rounded-[1.65rem] bg-white/86 p-6 shadow-[0_18px_60px_rgb(15_23_42/0.07)] ring-1 ring-zinc-200/80 backdrop-blur md:p-10" @submit.prevent="handleSaveName">
          <div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div class="flex items-center gap-4">
              <span class="flex size-14 shrink-0 items-center justify-center rounded-full bg-zinc-100 shadow-sm ring-1 ring-zinc-200">
                <img
                  src="https://res.cloudinary.com/dj6draudd/image/upload/v1784739808/id_card_3f820b87e1.png"
                  alt=""
                  class="size-8"
                />
              </span>
              <h2 class="font-display text-2xl font-bold text-slate-950">Información personal</h2>
            </div>
          </div>

          <div class="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
            <div class="grid gap-8 p-6 lg:grid-cols-2">
              <div>
                <label class="mb-3 block text-sm font-semibold text-slate-600">{{ $t('auth.displayName') }}</label>
                <div class="relative">
                  <input
                    v-model.trim="form.username"
                    type="text"
                    maxlength="40"
                    class="h-12 w-full rounded-2xl border border-zinc-200 bg-white px-5 pr-14 text-sm font-semibold text-slate-800 outline-none transition focus:border-iberia focus:ring-4 focus:ring-iberia/10"
                    :placeholder="$t('auth.usernamePlaceholder')"
                  />
                  <span
                    class="pointer-events-none absolute right-4 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-full bg-iberia/10 text-iberia"
                    aria-hidden="true"
                  >
                    <svg class="size-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M5 3a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8.1l.54-2H5V5h10v5h5v1.9l2-2V9.17a2 2 0 0 0-.59-1.41l-5.17-5.17A2 2 0 0 0 14.83 2H5v1Zm12 2.41L18.59 7H17V5.41ZM19.71 13.04a1.8 1.8 0 0 0-2.55 0l-6.27 6.27L10 23l3.69-.89 6.27-6.27a1.8 1.8 0 0 0 0-2.55l-.25-.25Zm-8.32-6.01H7a1 1 0 1 0 0 2h4.39a1 1 0 1 0 0-2Zm2 4H7a1 1 0 1 0 0 2h6.39a1 1 0 1 0 0-2Z"/>
                    </svg>
                  </span>
                </div>
                <p class="mt-4 text-sm font-medium text-slate-400">Este es el nombre que se mostrará públicamente.</p>
              </div>

              <div>
                <label class="mb-3 block text-sm font-semibold text-slate-600">{{ $t('auth.email') }}</label>
                <div class="relative">
                  <input
                    :value="user?.email"
                    type="email"
                    readonly
                    class="h-12 w-full rounded-2xl border border-zinc-200 bg-zinc-50/70 px-5 pr-14 text-sm font-semibold text-slate-800 outline-none"
                  />
                  <span
                    class="pointer-events-none absolute right-4 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-full bg-zinc-200 text-zinc-500"
                    aria-hidden="true"
                  >
                    <svg class="size-4" viewBox="0 0 24 24" fill="currentColor">
                      <path fill-rule="evenodd" d="M7 10V8a5 5 0 0 1 10 0v2h1a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h1Zm2 0h6V8a3 3 0 0 0-6 0v2Zm4 6.73V18a1 1 0 1 1-2 0v-1.27a2 2 0 1 1 2 0Z" clip-rule="evenodd"/>
                    </svg>
                  </span>
                </div>
                <p class="mt-4 text-sm font-medium text-slate-400">Tu correo electrónico no será visible públicamente.</p>
              </div>
            </div>

            <div class="flex flex-col gap-5 border-t border-zinc-200 p-6 lg:flex-row lg:items-center lg:justify-between">
              <div class="flex min-w-0 items-center gap-4">
                <img
                  v-if="profileAvatar"
                  :src="profileAvatar"
                  :alt="user?.username ?? ''"
                  class="size-14 shrink-0 rounded-full object-cover ring-1 ring-zinc-200"
                />
                <span v-else class="flex size-14 shrink-0 items-center justify-center rounded-full bg-iberia text-base font-bold text-white">
                  {{ userInitial }}
                </span>
                <div>
                  <p class="text-sm font-semibold text-slate-600">{{ $t('auth.profilePicture') }}</p>
                  <p class="mt-1 text-sm font-medium text-slate-400">JPG, PNG o GIF. Tamaño máximo 2MB.</p>
                </div>
              </div>

              <div class="flex flex-wrap gap-3">
                <label class="inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-full border border-zinc-200 bg-white px-6 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-iberia/30 hover:text-iberia">
                  <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <path d="m17 8-5-5-5 5"/>
                    <path d="M12 3v12"/>
                  </svg>
                  {{ avatarSaving ? $t('auth.saving') : $t('auth.changePicture') }}
                  <input
                    ref="avatarInput"
                    type="file"
                    accept="image/*"
                    class="sr-only"
                    :disabled="avatarSaving"
                    @change="handleAvatarUpload"
                  />
                </label>
                <button
                  v-if="profileAvatar"
                  type="button"
                  class="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-red-200 bg-white px-6 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                  @click="handleRemoveAvatar"
                >
                  <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M3 6h18"/>
                    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    <path d="M19 6 18 20a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                  </svg>
                  {{ $t('auth.removePicture') }}
                </button>
              </div>
            </div>
          </div>

          <p v-if="message" class="mt-5 text-sm font-semibold" :class="messageType === 'success' ? 'text-green-600' : 'text-red-600'">
            {{ message }}
          </p>

          <button
            type="submit"
            class="mt-6 inline-flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-iberia px-6 text-base font-bold text-white shadow-lg shadow-iberia/20 transition hover:bg-iberia-dark disabled:cursor-not-allowed disabled:opacity-60"
            :disabled="saving || !form.username"
          >
            <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z"/>
              <path d="M17 21v-8H7v8"/>
              <path d="M7 3v5h8"/>
            </svg>
            {{ saving ? $t('auth.saving') : $t('auth.saveChanges') }}
          </button>
        </form>

        <section class="rounded-[1.65rem] bg-white/86 p-6 shadow-[0_18px_60px_rgb(15_23_42/0.07)] ring-1 ring-zinc-200/80 backdrop-blur md:p-10">
          <div class="mb-8 flex items-center justify-between gap-4">
            <div class="flex items-center gap-4">
              <span class="flex size-14 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-700">
                <svg class="size-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.68-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1Z"/>
                  <path d="m9 12 2 2 4-4"/>
                </svg>
              </span>
              <h2 class="font-display text-2xl font-bold text-slate-950">Información de la cuenta</h2>
            </div>

            <button
              type="button"
              class="hidden h-11 items-center justify-center gap-2 rounded-full border border-zinc-200 bg-white px-5 text-sm font-semibold text-red-600 transition hover:bg-red-50 sm:inline-flex"
              @click="handleLogout"
            >
              <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <path d="m16 17 5-5-5-5"/>
                <path d="M21 12H9"/>
              </svg>
              {{ $t('auth.logout') }}
            </button>
          </div>

          <dl class="grid overflow-hidden rounded-2xl border border-zinc-200 bg-white sm:grid-cols-2 xl:grid-cols-4">
            <div class="account-stat">
              <dt>
                <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06A1.65 1.65 0 0 0 15 19.4a1.65 1.65 0 0 0-1 .6 1.65 1.65 0 0 0-.33 1.82V22a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-.6-1 1.65 1.65 0 0 0-1.82-.33H2a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-.6 1.65 1.65 0 0 0 .33-1.82V2a2 2 0 0 1 4 0v.09A1.65 1.65 0 0 0 15 4.6a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9c.22.36.58.6 1 .6H22a2 2 0 0 1 0 4h-.09c-.42 0-.78.24-1 .6Z"/>
                </svg>
                {{ $t('auth.username') }}
              </dt>
              <dd>
                {{ user?.username }}
                <button
                  type="button"
                  class="ml-2 inline-flex size-5 items-center justify-center text-slate-400 transition hover:text-iberia"
                  title="Copiar"
                  aria-label="Copiar nombre de usuario"
                  @click="copyUsername"
                >
                  <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect width="14" height="14" x="8" y="8" rx="2"/>
                    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
                  </svg>
                </button>
              </dd>
            </div>

            <div class="account-stat">
              <dt>
                <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20 6 9 17l-5-5"/>
                </svg>
                {{ $t('auth.accountStatus') }}
              </dt>
              <dd>
                <span class="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-bold" :class="user?.confirmed ? 'bg-emerald-100 text-emerald-700' : 'bg-yellow-100 text-yellow-700'">
                  <span class="size-2 rounded-full" :class="user?.confirmed ? 'bg-emerald-500' : 'bg-yellow-500'" />
                  {{ user?.confirmed ? $t('auth.confirmed') : $t('auth.unconfirmed') }}
                </span>
              </dd>
            </div>

            <div class="account-stat">
              <dt>
                <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20 7h-9"/>
                  <path d="M14 17H5"/>
                  <circle cx="17" cy="17" r="3"/>
                  <circle cx="7" cy="7" r="3"/>
                </svg>
                {{ $t('auth.membershipType') }}
              </dt>
              <dd>
                <span class="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-bold" :class="isSubscriber ? 'bg-amber-100 text-amber-700' : 'bg-iberia/10 text-iberia'">
                  <svg v-if="isSubscriber" class="size-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                  <span v-else class="size-2 rounded-full bg-iberia" />
                  {{ isSubscriber ? $t('auth.memberTypeSubscriber') : $t('auth.memberTypeMember') }}
                </span>
              </dd>
            </div>

            <div class="account-stat">
              <dt>
                <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M8 2v4"/>
                  <path d="M16 2v4"/>
                  <rect width="18" height="18" x="3" y="4" rx="2"/>
                  <path d="M3 10h18"/>
                </svg>
                Miembro desde
              </dt>
              <dd>{{ memberSince }}</dd>
            </div>
          </dl>

          <button
            type="button"
            class="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border border-zinc-200 bg-white px-5 text-sm font-semibold text-red-600 transition hover:bg-red-50 sm:hidden"
            @click="handleLogout"
          >
            {{ $t('auth.logout') }}
          </button>
        </section>
      </section>
    </main>
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
const { t, locale } = useI18n()
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
const avatarSaving = ref(false)
const message = ref('')
const messageType = ref<'success' | 'error'>('success')

const memberSince = computed(() => {
  const createdAt = (user.value as { createdAt?: string } | null)?.createdAt
  if (!createdAt) return '-'

  return new Intl.DateTimeFormat(locale.value === 'ge' ? 'ka-GE' : 'es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(createdAt))
})

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

async function copyUsername() {
  if (!user.value?.username || !navigator?.clipboard) return
  await navigator.clipboard.writeText(user.value.username)
}

function setMessage(type: 'success' | 'error', text: string) {
  messageType.value = type
  message.value = text
}

function authHeaders() {
  const token = useCookie<string | null>('auth_token')
  return token.value ? { Authorization: `Bearer ${token.value}` } : {}
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

async function handleAvatarUpload(event: Event) {
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

  avatarSaving.value = true
  message.value = ''

  try {
    const data = new FormData()
    data.append('file', file)

    const uploaded = await $fetch<{ id: number, src: string }>('/api/auth/avatar', {
      method: 'POST',
      headers: authHeaders(),
      body: data,
    })

    await saveProfileAvatar(uploaded.src, uploaded.id)
    setMessage('success', t('auth.profileSaved'))
  }
  catch {
    setMessage('error', t('auth.profileSaveError'))
  }
  finally {
    avatarSaving.value = false
    input.value = ''
  }
}

async function handleRemoveAvatar() {
  avatarSaving.value = true
  message.value = ''

  try {
    await saveProfileAvatar(null)
    if (avatarInput.value) avatarInput.value.value = ''
    setMessage('success', t('auth.profileSaved'))
  }
  catch {
    setMessage('error', t('auth.profileSaveError'))
  }
  finally {
    avatarSaving.value = false
  }
}
</script>

<style scoped>
.account-shell {
  display: grid;
  gap: 0.35rem;
  max-width: 62rem;
}

.account-stat {
  display: grid;
  min-height: 7.2rem;
  align-content: center;
  gap: 0.85rem;
  border-color: rgb(228 228 231);
  padding: 1.5rem;
}

.account-stat + .account-stat {
  border-top-width: 1px;
}

.account-stat dt {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  text-align: center;
  font-size: 0.875rem;
  font-weight: 700;
  color: rgb(100 116 139);
}

.account-stat dd {
  display: flex;
  min-width: 0;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 0.95rem;
  font-weight: 700;
  color: rgb(51 65 85);
}

@media (min-width: 640px) {
  .account-stat:nth-child(2n) {
    border-left-width: 1px;
  }

  .account-stat:nth-child(2) {
    border-top-width: 0;
  }
}

@media (min-width: 1280px) {
  .account-stat + .account-stat {
    border-top-width: 0;
    border-left-width: 1px;
  }
}
</style>
