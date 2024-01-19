<template>
  <teleport to="#main">
    <div class="fixed z-30 h-full w-full overflow-hidden bg-black bg-opacity-50">
      <div class="flex h-full items-center justify-center">
        <div class="w-full max-w-lg rounded-xl bg-white lg:h-[56.25rem]">
          <slot></slot>
        </div>
      </div>
    </div>
  </teleport>
</template>
<script setup>
import { onMounted, onUnmounted } from 'vue'

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
