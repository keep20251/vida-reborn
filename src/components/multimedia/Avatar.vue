<template>
  <div class="relative flex-shrink-0" :style="style">
    <img class="rounded-inherit h-full w-full object-cover" :src="props.src" :alt="props.alt" />
    <div v-if="cameraIcon" class="absolute left-55 top-40 cursor-pointer">
      <div class="flex h-30 w-30 items-center justify-center rounded-full bg-light-gray">
        <Icon class="" name="camera" size="20"></Icon>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  src: { type: String },
  alt: { type: String, default: 'Avatar' },
  radius: { type: Number },
  cameraIcon: { type: Boolean, default: false },
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
