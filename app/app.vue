<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()

const OG_DEFAULT = 'https://res.cloudinary.com/dj6draudd/image/upload/v1771671526/contact_scaled_8ca2bf7adb.jpg'

// Defaults globales — cada página sobreescribe los suyos
useSeoMeta({
  ogSiteName: 'Iberia',
  ogType: 'website',
  ogImage: OG_DEFAULT,
  ogImageWidth: 1200,
  ogImageHeight: 630,
  twitterCard: 'summary_large_image',
  twitterImage: OG_DEFAULT,
})
</script>
