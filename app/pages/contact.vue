<template>
  <div>
    <PageHero
      eyebrow="Iberia"
      :title="$t('contact1')"
      :subtitle="$t('contact2')"
    />

    <section class="py-20 lg:py-28">
      <div class="container mx-auto px-4 lg:px-6">
        <div class="grid gap-16 lg:grid-cols-2">

          <!-- Contact info -->
          <div>
            <h2 class="text-2xl font-bold text-zinc-800">{{ $t('footer') }}</h2>

            <div class="mt-8 space-y-6">
              <div class="flex items-start gap-4">
                <div class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-iberia/10">
                  <svg class="size-5 text-iberia" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 7l10 7 10-7"/>
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-medium text-zinc-500">{{ $t('contactemail') }}</p>
                  <a href="mailto:asociacioniberia@gmail.com" class="mt-0.5 font-medium text-zinc-800 hover:text-iberia transition-colors">
                    asociacioniberia@gmail.com
                  </a>
                </div>
              </div>

              <div class="flex items-start gap-4">
                <div class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-iberia/10">
                  <svg class="size-5 text-iberia" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-medium text-zinc-500">{{ $t('contactphone') }}</p>
                  <div class="mt-0.5 space-y-1">
                    <a href="tel:+995599634393" class="block font-medium text-zinc-800 hover:text-iberia transition-colors">+995 599 634 393</a>
                    <a href="tel:+995568618086" class="block font-medium text-zinc-800 hover:text-iberia transition-colors">+995 568 61 80 86</a>
                    <a href="tel:+34722512017" class="block font-medium text-zinc-800 hover:text-iberia transition-colors">+34 722 512 017</a>
                  </div>
                </div>
              </div>
            </div>

            <div class="mt-10 overflow-hidden rounded-2xl">
              <img
                src="https://res.cloudinary.com/dj6draudd/image/upload/v1771671526/contact_scaled_8ca2bf7adb.jpg"
                :alt="$t('contact1')"
                class="w-full object-cover"
                loading="lazy"
              />
            </div>
          </div>

          <!-- Form -->
          <div>
            <h2 class="text-2xl font-bold text-zinc-800">{{ $t('contactsend') }}</h2>

            <form class="mt-8 space-y-5" @submit.prevent="handleSubmit">

              <div>
                <label for="name" class="block text-sm font-medium text-zinc-700">
                  {{ $t('contactname') }}
                </label>
                <input
                  id="name"
                  v-model="form.name"
                  type="text"
                  required
                  :placeholder="`${$t('contacttu')} ${$t('contactname')}`"
                  class="mt-1.5 w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm text-zinc-800 outline-none transition-all placeholder:text-zinc-400 focus:border-iberia focus:ring-2 focus:ring-iberia/10"
                />
              </div>

              <div>
                <label for="email" class="block text-sm font-medium text-zinc-700">
                  {{ $t('contactemail') }}
                </label>
                <input
                  id="email"
                  v-model="form.email"
                  type="email"
                  required
                  :placeholder="`${$t('contacttu')} ${$t('contactemail')}`"
                  class="mt-1.5 w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm text-zinc-800 outline-none transition-all placeholder:text-zinc-400 focus:border-iberia focus:ring-2 focus:ring-iberia/10"
                />
              </div>

              <div>
                <label for="mensaje" class="block text-sm font-medium text-zinc-700">
                  {{ $t('contacttext') }}
                </label>
                <textarea
                  id="mensaje"
                  v-model="form.texto"
                  rows="6"
                  required
                  :placeholder="$t('contacttext')"
                  class="mt-1.5 w-full resize-none rounded-xl border border-zinc-200 px-4 py-3 text-sm text-zinc-800 outline-none transition-all placeholder:text-zinc-400 focus:border-iberia focus:ring-2 focus:ring-iberia/10"
                />
              </div>

              <!-- Privacy checkbox -->
              <div class="flex items-start gap-3">
                <button
                  type="button"
                  role="checkbox"
                  :aria-checked="form.accepted"
                  class="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded border-2 transition-all"
                  :class="form.accepted ? 'border-iberia bg-iberia' : 'border-zinc-300'"
                  @click="form.accepted = !form.accepted"
                >
                  <svg v-if="form.accepted" class="size-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20 6L9 17l-5-5"/>
                  </svg>
                </button>
                <p class="text-sm text-zinc-600">
                  {{ $t('contact3') }}
                  <NuxtLink :to="localePath('/politica-de-privacidad')" class="text-iberia underline underline-offset-2">
                    {{ $t('contactprivacity') }}
                  </NuxtLink>
                </p>
              </div>

              <p v-if="showError" class="text-sm text-red-500">{{ $t('contact4') }}</p>

              <!-- Success message -->
              <div v-if="success" class="rounded-xl bg-green-50 border border-green-100 p-4">
                <p class="font-semibold text-green-800">{{ $t('contact5') }}</p>
                <p class="mt-1 text-sm text-green-700">{{ $t('contact6') }}</p>
              </div>

              <button
                type="submit"
                :disabled="loading || !form.accepted"
                class="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-50"
                :class="form.accepted ? 'bg-iberia text-white hover:bg-iberia-dark' : 'bg-zinc-100 text-zinc-400'"
              >
                <template v-if="loading">
                  <svg class="size-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  {{ $t('loading') }}
                </template>
                <template v-else>
                  {{ $t('contactsend') }}
                </template>
              </button>
            </form>
          </div>

        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()

const url = useRequestURL()
const OG_IMAGE = 'https://res.cloudinary.com/dj6draudd/image/upload/v1771671526/contact_scaled_8ca2bf7adb.jpg'

useSeoMeta({
  title: `${t('contact1')} — Iberia`,
  description: t('contact2'),
  ogTitle: t('contact1'),
  ogDescription: t('contact2'),
  ogImage: OG_IMAGE,
  ogUrl: url.href,
  ogType: 'website',
  twitterTitle: t('contact1'),
  twitterDescription: t('contact2'),
  twitterImage: OG_IMAGE,
})

useHead({ link: [{ rel: 'canonical', href: url.href }] })

const form = reactive({
  name: '',
  email: '',
  texto: '',
  accepted: false,
})

const loading = ref(false)
const success = ref(false)
const showError = ref(false)

function handleSubmit() {
  if (!form.accepted) {
    showError.value = true
    return
  }
  showError.value = false

  const subject = encodeURIComponent(`Mensaje de ${form.name} — iberiainfo.me`)
  const body = encodeURIComponent(`Nombre: ${form.name}\nEmail: ${form.email}\n\n${form.texto}`)
  window.location.href = `mailto:asociacioniberia@gmail.com?subject=${subject}&body=${body}`

  success.value = true
  form.name = ''
  form.email = ''
  form.texto = ''
  form.accepted = false
}
</script>
