<template>
  <teleport to="#main">
    <div class="fixed top-0 z-30 h-full w-full overflow-hidden bg-black bg-opacity-50">
      <div class="flex h-full items-center justify-center" @click.self="$emit('click:around')">
        <div
          :class="{
            'mx-24 px-20 py-30 sm:px-16 sm:py-24': !noPadding,
            'mx-20': noPadding,
            [maxWidth]: true,
            'w-full': !!maxWidth,
          }"
          class="rounded-xl bg-white"
        >
          <slot></slot>
        </div>
      </div>
    </div>
  </teleport>
</template>
<script setup>
import { computed, onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/store/app'

const props = defineProps({
  noPadding: { type: Boolean, default: false },
  size: { type: String, default: 'lg' },
})

defineEmits(['click:around'])

const maxWidth = computed(() => {
  if (props.size === '7xl') return 'max-w-7xl'
  if (props.size === '6xl') return 'max-w-6xl'
  if (props.size === '5xl') return 'max-w-5xl'
  if (props.size === '4xl') return 'max-w-4xl'
  if (props.size === '3xl') return 'max-w-3xl'
  if (props.size === '2xl') return 'max-w-2xl'
  if (props.size === 'xl') return 'max-w-xl'
  if (props.size === 'lg') return 'max-w-lg'
  if (props.size === 'md') return 'max-w-md'
  if (props.size === 'sm') return 'max-w-sm'
  if (props.size === 'auto') return ''
  return 'lg'
})

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
