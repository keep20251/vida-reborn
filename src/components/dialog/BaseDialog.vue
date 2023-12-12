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

onMounted(() => (document.body.style.overflowY = 'hidden'))
onUnmounted(() => (document.body.style.overflowY = 'auto'))
</script>
