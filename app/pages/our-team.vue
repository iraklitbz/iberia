<template>
  <div>

    <!-- Hero -->
    <section class="bg-white pb-16 pt-32 lg:pb-24 lg:pt-40">
      <div class="container mx-auto px-4 text-center lg:px-6">
        <span class="inline-flex items-center gap-2 rounded-full bg-iberia/10 px-4 py-1.5 text-sm font-semibold text-iberia">
          <span class="inline-block size-1.5 rounded-full bg-iberia" />
          {{ locale === 'es' ? 'Nuestro equipo' : 'ჩვენი გუნდი' }}
        </span>
        <h1 class="mt-5 text-3xl font-bold text-zinc-900 lg:text-5xl">
          {{ locale === 'es' ? 'Las personas detrás de Iberia' : 'ადამიანები, ვინც ქმნიან იბერიას' }}
        </h1>
        <p class="mx-auto mt-4 max-w-xl text-zinc-500">{{ $t('aboutus5') }}</p>

        <!-- Counter pill -->
        <div class="mt-10 inline-flex items-baseline gap-2 rounded-2xl border border-zinc-100 bg-zinc-50 px-7 py-4">
          <span class="text-4xl font-bold tabular-nums text-iberia">9</span>
          <span class="text-sm font-medium text-zinc-500">
            {{ locale === 'es' ? 'profesionales' : 'პროფესიონალი' }}
          </span>
        </div>
      </div>
    </section>

    <!-- Featured founder -->
    <section class="relative overflow-hidden bg-zinc-900 py-14 lg:py-20">
      <!-- Blobs rojos -->
      <div class="absolute -right-40 -top-40 size-96 rounded-full bg-iberia/20 blur-3xl" />
      <div class="absolute -bottom-20 -left-20 size-64 rounded-full bg-iberia/10 blur-3xl" />
      <!-- Blobs amarillos -->
      <div class="absolute -right-24 top-1/2 size-72 -translate-y-1/2 rounded-full bg-yellow-400/8 blur-3xl" />
      <div class="absolute -top-10 left-1/3 size-56 rounded-full bg-yellow-300/6 blur-3xl" />
      <div class="container relative mx-auto px-4 lg:px-6">
        <div class="mx-auto flex max-w-3xl flex-col items-center gap-8 sm:flex-row sm:items-start sm:gap-12">

          <!-- Photo -->
          <div class="shrink-0">
            <div class="relative">
              <img
                :src="teamMembers[0].profileUrl"
                :alt="teamMembers[0].name"
                class="size-44 rounded-3xl object-cover lg:size-52"
                loading="eager"
              />
              <!-- iberia accent dot -->
              <span class="absolute -bottom-2 -right-2 size-8 rounded-full bg-iberia ring-4 ring-zinc-900" />
            </div>
          </div>

          <!-- Text -->
          <div class="text-center sm:text-left">
            <p class="text-xs font-semibold uppercase tracking-widest text-iberia">
              {{ locale === 'es' ? 'Fundadora & Presidenta' : 'დამფუძნებელი & პრეზიდენტი' }}
            </p>
            <h2 class="mt-2 text-2xl font-bold text-white lg:text-3xl">
              {{ teamMembers[0].name }}
            </h2>
            <p class="mt-3 leading-relaxed text-zinc-400" v-html="teamMembers[0].role" />
          </div>

        </div>
      </div>
    </section>

    <!-- Team grid (rest of members) -->
    <section class="bg-zinc-50 py-16 lg:py-24">
      <div class="container mx-auto px-4 lg:px-6">

        <p class="mb-10 text-center text-xs font-semibold uppercase tracking-widest text-zinc-400">
          {{ locale === 'es' ? 'El resto del equipo' : 'დანარჩენი გუნდი' }}
        </p>

        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div
            v-for="member in teamMembers.slice(1)"
            :key="member.id"
            class="group relative aspect-[3/4] cursor-default overflow-hidden rounded-2xl bg-zinc-200"
          >
            <!-- Photo -->
            <img
              :src="member.profileUrl"
              :alt="member.name"
              class="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />

            <!-- Gradient overlay -->
            <div class="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/30 to-transparent" />

            <!-- iberia line reveal on hover -->
            <div class="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-iberia transition-transform duration-300 group-hover:scale-x-100" />

            <!-- Text -->
            <div class="absolute inset-x-0 bottom-0 p-5">
              <h3 class="font-bold text-white">{{ member.name }}</h3>
              <p class="mt-1 text-xs leading-relaxed text-zinc-300" v-html="member.role" />
            </div>
          </div>
        </div>

      </div>
    </section>

    <!-- CTA -->
    <section class="border-t border-zinc-100 py-16">
      <div class="container mx-auto px-4 text-center lg:px-6">
        <p class="text-sm font-semibold uppercase tracking-widest text-iberia">
          {{ locale === 'es' ? '¿Quieres saber más?' : 'გინდა მეტი გაიგო?' }}
        </p>
        <h2 class="mt-3 text-2xl font-bold text-zinc-900 lg:text-3xl">
          {{ locale === 'es' ? 'Estamos aquí para ayudarte' : 'ჩვენ აქ ვართ შენი დასახმარებლად' }}
        </h2>
        <div class="mt-8 flex flex-wrap justify-center gap-4">
          <NuxtLink
            :to="localePath('/contact')"
            class="inline-flex items-center gap-2 rounded-xl bg-iberia px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-iberia-dark"
          >
            {{ $t('contactus') }}
            <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </NuxtLink>
          <NuxtLink
            :to="localePath('/about')"
            class="inline-flex items-center gap-2 rounded-xl border border-zinc-200 px-6 py-3 text-sm font-semibold text-zinc-700 transition-all hover:border-zinc-300 hover:bg-zinc-50"
          >
            {{ $t('aboutus') }}
          </NuxtLink>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup lang="ts">
const { t, locale } = useI18n()
const localePath = useLocalePath()

const url = useRequestURL()
const OG_IMAGE = 'https://iberiainfo.me/wp-content/uploads/2022/02/kety.jpg'

useSeoMeta({
  title: `${t('ourteam')} — Iberia`,
  description: t('aboutus5'),
  ogTitle: t('ourteam'),
  ogDescription: t('aboutus5'),
  ogImage: OG_IMAGE,
  ogUrl: url.href,
  ogType: 'website',
  twitterTitle: t('ourteam'),
  twitterDescription: t('aboutus5'),
  twitterImage: OG_IMAGE,
})

useHead({ link: [{ rel: 'canonical', href: url.href }] })

const teamMembers = computed(() => [
  {
    id: '1',
    name: t('ourteam_team1_1'),
    role: t('ourteam_team1_2'),
    profileUrl: 'https://iberiainfo.me/wp-content/uploads/2022/02/kety.jpg',
  },
  {
    id: '2',
    name: t('ourteam_team2_1'),
    role: t('ourteam_team2_2'),
    profileUrl: 'https://iberiainfo.me/wp-content/uploads/2022/02/Lana.jpg',
  },
  {
    id: '3',
    name: t('ourteam_team3_1'),
    role: t('ourteam_team3_2'),
    profileUrl: 'http://cms.iberiainfo.me/wp-content/uploads/2023/06/tako.jpg',
  },
  {
    id: '4',
    name: t('ourteam_team4_1'),
    role: t('ourteam_team4_2'),
    profileUrl: 'http://cms.iberiainfo.me/wp-content/uploads/2023/06/magda.jpg',
  },
  {
    id: '5',
    name: t('ourteam_team5_1'),
    role: t('ourteam_team5_2'),
    profileUrl: 'https://iberiainfo.me/wp-content/uploads/2022/02/tamar.jpg',
  },
  {
    id: '6',
    name: t('ourteam_team6_1'),
    role: t('ourteam_team6_2'),
    profileUrl: 'https://iberiainfo.me/wp-content/uploads/2022/02/nana.jpg',
  },
  {
    id: '7',
    name: t('ourteam_team7_1'),
    role: t('ourteam_team7_2'),
    profileUrl: 'https://iberiainfo.me/wp-content/uploads/2022/02/ani.jpg',
  },
  {
    id: '8',
    name: t('ourteam_team8_1'),
    role: t('ourteam_team8_2'),
    profileUrl: 'http://cms.iberiainfo.me/wp-content/uploads/2023/06/hugo.jpg',
  },
  {
    id: '9',
    name: t('ourteam_team9_1'),
    role: t('ourteam_team9_2'),
    profileUrl: 'http://cms.iberiainfo.me/wp-content/uploads/2023/06/manu.jpg',
  },
])
</script>
