<template>
  <div class="relative flex-shrink-0" :style="style">
    <div v-if="props.src" class="h-full w-full rounded-inherit object-cover">
      <EncryptImage :src="props.src" :border-radius="radius" cover :click-to-full="clickToFull"></EncryptImage>
    </div>
    <div v-else class="h-full w-full rounded-inherit bg-gray-f6">
      <img class="h-full w-full rounded-inherit" src="@/assets/images/default-avatar.svg?url" alt="DefaultAvatar" />
    </div>
    <div v-if="cameraIcon" class="absolute left-55 top-40 cursor-pointer" @click.stop="emits('click:camera')">
      <div class="flex h-30 w-30 items-center justify-center rounded-full bg-light-gray">
        <Icon class="" name="camera" size="20"></Icon>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const emits = defineEmits(['click:camera'])

const props = defineProps({
  src: { type: String },
  alt: { type: String, default: 'Avatar' },
  radius: { type: Number },
  cameraIcon: { type: Boolean, default: false },
  clickToFull: { type: Boolean, default: false },
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
