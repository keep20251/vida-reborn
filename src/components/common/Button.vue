<template>
  <button
    class="flex items-center justify-center rounded-full text-white"
    :class="[bg, height, font, padding, { 'w-full': size === 'lg' }]"
    :disabled="loading"
    @click="$emit('click')"
  >
    <div v-if="loading" class="flex flex-row space-x-4">
      <div class="animate-bounce rounded-full bg-white" :class="[loadingSize]"></div>
      <div class="animate-bounce rounded-full bg-white [animation-delay:-.3s]" :class="[loadingSize]"></div>
      <div class="animate-bounce rounded-full bg-white [animation-delay:-.5s]" :class="[loadingSize]"></div>
    </div>
    <slot v-else></slot>
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  contrast: { type: Boolean, default: false },
  cancel: { type: Boolean, default: false },
  gradient: { type: Boolean, default: false },
  size: { type: String, default: 'lg' }, // lg | md | sm
  loading: { type: Boolean, default: false },
})

defineEmits(['click'])

const bg = computed(() => {
  return props.contrast
    ? 'bg-contrast'
    : props.cancel
      ? 'bg-gray30'
      : props.gradient
        ? 'bg-gradient-to-r from-primary to-contrast'
        : 'bg-primary'
})

const height = computed(() => {
  switch (props.size) {
    case 'md':
      return 'h-30'
    case 'sm':
      return 'h-24'
    case 'lg':
    default:
      return 'h-36'
  }
})

const loadingSize = computed(() => {
  switch (props.size) {
    case 'md':
      return 'h-4 w-4'
    case 'sm':
      return 'h-3 w-3'
    case 'lg':
    default:
      return 'h-6 w-6'
  }
})

const padding = computed(() => {
  switch (props.size) {
    case 'md':
    case 'sm':
      return 'px-18 py-6'
    case 'lg':
    default:
      return 'px-45 py-10'
  }
})

const font = computed(() => {
  switch (props.size) {
    case 'md':
    case 'sm':
      return 'text-sm font-normal'
    case 'lg':
    default:
      return 'text-base font-bold'
  }
})
</script>
