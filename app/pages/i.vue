<template>
  <div>
    <section class="relative min-h-[520px] overflow-hidden bg-[linear-gradient(to_bottom,#6A4037_0%,#6A4037_54%,#EBC5AB_54%,#EBC5AB_100%)] pt-16 lg:min-h-[760px] lg:pt-[70px]">
      <img
        src="/i-hero.jpg"
        alt=""
        aria-hidden="true"
        class="absolute inset-0 h-full w-full object-contain object-top"
      />

    </section>

    <section class="relative min-h-[28rem] bg-gradient-to-b from-[#EBC5AB] to-[#DDAE8E] py-16">
      <div class="absolute left-[5%] -top-28 z-10 aspect-[9/16] w-[40vw] max-w-[280px] overflow-hidden rounded-xl shadow-xl sm:w-[30vw] lg:-top-48 lg:w-[14vw]">
        <video
          src="https://res.cloudinary.com/dj6draudd/video/upload/v1791461758/Whats_App_Video_2026_10_07_at_19_18_07_8944e9677f.mp4"
          controls
          playsinline
          preload="metadata"
          class="size-full object-contain object-top"
          aria-label="Video de Iberia"
        />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default', headerSolid: true })

const url = useRequestURL()

useSeoMeta({
  title: 'I - Iberia',
  description: 'I',
  ogTitle: 'I',
  ogDescription: 'I',
  ogUrl: url.href,
  ogType: 'website',
  twitterTitle: 'I',
  twitterDescription: 'I',
})

useHead({ link: [{ rel: 'canonical', href: url.href }] })
</script>
