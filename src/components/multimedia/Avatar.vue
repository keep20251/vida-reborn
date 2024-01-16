<template>
  <div class="flex-shrink-0" :style="style">
    <img class="h-full w-full rounded-[inherit] object-cover" :src="props.src" :alt="props.alt" />
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  src: { type: String },
  alt: { type: String, default: 'Avatar' },
  radius: { type: Number },
})

const style = computed(() => {
  const lenVal = `${props.radius / 16}rem`
  return {
    width: lenVal,
    height: lenVal,
    borderRadius: lenVal,
  }
})
</script>
