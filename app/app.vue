<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()

const OG_DEFAULT = 'https://iberiainfo.me/wp-content/uploads/2022/02/contact-scaled.jpg'

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
