<template>
  <div
    class="gap-row flex h-35 w-full shrink-0 appearance-none items-center space-x-10 divide-solid rounded-2xl border-gray-cc bg-white px-20 py-12 text-sm font-normal not-italic leading-3 text-gray-57 shadow-input outline-none"
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
