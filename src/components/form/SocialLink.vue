<template>
  <div
    class="gap-row text-gray-57 border-gray-cc flex h-35 w-full shrink-0 items-center space-x-10 divide-solid rounded-2xl bg-white px-20 py-12 text-sm font-normal not-italic leading-3 shadow-[0_-0.0625rem_0.5rem_0_rgba(0,0,0,0.1)inset] outline-none"
  >
    <Icon :name="props.icon" size="15"></Icon>
    <p class="text-sm font-normal leading-3">{{ props.url }}</p>
  </div>
</template>
<script setup>
const props = defineProps({
  icon: {
    type: String,
    default: 'socialInstagram',
  },
  url: {
    type: String,
    default: 'https://www.instagram.com/abc123',
  },
})
</script>
