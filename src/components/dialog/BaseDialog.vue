<template>
  <teleport to="#main">
    <div class="fixed z-30 h-full w-full overflow-hidden bg-black bg-opacity-50">
      <div class="flex h-full items-center justify-center" @click.self="$emit('click:around')">
        <div
          :class="{
            'mx-24 px-20 py-30 sm:px-16 sm:py-24': !noPadding,
            'mx-20': noPadding,
          }"
          class="h-max-[80%] w-full max-w-lg rounded-xl bg-white"
        >
          <slot></slot>
        </div>
      </div>
    </div>
  </teleport>
</template>
<script setup>
import { onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/store/app'

defineProps({
  noPadding: { type: Boolean, default: false },
})
defineEmits(['click:around'])

const appStore = useAppStore()
const { isDesktop } = storeToRefs(appStore)

let html = null
onMounted(() => {
  html = document.getElementsByTagName('html')[0]
  html.style.overflow = 'hidden'
  if (isDesktop.value) html.style.marginRight = '15px'
})
onUnmounted(() => {
  html.style.overflow = ''
  if (isDesktop.value) html.style.marginRight = ''
})
</script>
