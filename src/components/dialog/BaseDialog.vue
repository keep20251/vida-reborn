<template>
  <teleport to="#main">
    <div class="fixed z-30 h-full w-full overflow-hidden bg-black bg-opacity-50">
      <div class="flex h-full items-center justify-center" @click.self="$emit('click:around')">
        <div
          :class="{
            'h-max-[80%] mx-24 px-20 py-30 sm:px-16 sm:py-24': !noPadding,
            'h-max-[100%]': noPadding,
          }"
          class="bg-white w-full max-w-lg rounded-xl"
        >
          <slot></slot>
        </div>
      </div>
    </div>
  </teleport>
</template>
<script setup>
import { onMounted, onUnmounted } from 'vue'

defineProps({
  noPadding: { type: Boolean, default: false },
})
defineEmits(['click:around'])

let html = null

onMounted(() => {
  html = document.getElementsByTagName('html')[0]
  html.style.overflow = 'hidden'
  html.style.marginRight = '12px'
})
onUnmounted(() => {
  html.style.overflow = ''
  html.style.marginRight = ''
})
</script>
