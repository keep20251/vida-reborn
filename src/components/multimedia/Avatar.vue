<template>
  <div class="relative flex-shrink-0" :style="style">
    <div v-if="props.src" class="h-full w-full rounded-inherit object-cover">
      <EncryptImage :src="props.src" :border-radius="radius" cover></EncryptImage>
    </div>
    <img v-else :src="defaultAvatar" class="h-full w-full rounded-inherit object-cover" />
    <div v-if="cameraIcon" class="absolute left-55 top-40 cursor-pointer">
      <div class="flex h-30 w-30 items-center justify-center rounded-full bg-light-gray">
        <Icon class="" name="camera" size="20"></Icon>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import defaultAvatar from '@/assets/images/avatar.jpeg'

const props = defineProps({
  src: { type: String },
  alt: { type: String, default: 'Avatar' },
  radius: { type: Number },
  cameraIcon: { type: Boolean, default: false },
})

const style = computed(() => {
  const lenVal = `${(props.radius * 2) / 16}rem`
  return {
    width: lenVal,
    height: lenVal,
    borderRadius: lenVal,
  }
})
</script>
