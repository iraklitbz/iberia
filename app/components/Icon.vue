<template>
  <span class="icon">
    <component
      :is="icon"
      :filled="filled"
      class="size-[1em] align-middle"
      :class="{ 'icon--filled': !filled, 'mb-[0.125em]': autoAlign }"
    />
  </span>
</template>

<script setup lang="ts">
defineProps({
  filled: {
    type: Boolean,
    default: false,
  },
  icon: {
    type: Object,
    required: true,
  },
  autoAlign: {
    type: Boolean,
    default: true,
  },
})
</script>
