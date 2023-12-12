<template>
  <teleport to="#main">
    <div class="fixed h-full w-full overflow-hidden bg-black bg-opacity-50">
      <div class="flex h-full items-center justify-center">
        <div class="m-100 mx-20 w-full max-w-lg rounded-xl bg-white">
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
  html.style.overflow = 'auto'
  html.style.marginRight = ''
})
</script>
