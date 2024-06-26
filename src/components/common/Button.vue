<template>
  <button
    class="flex items-center justify-center rounded-full text-white"
    :class="[
      bg,
      height,
      font,
      padding,
      { 'w-full': size === 'lg' && !fitWidth, 'border-[1.5px] border-gray-57': !!border, '!text-black': !!textDark },
    ]"
    :disabled="loading || disabled"
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
  bgLight: { type: Boolean, default: false },
  cancel: { type: Boolean, default: false },
  gradient: { type: Boolean, default: false },
  size: { type: String, default: 'lg' }, // lg | md | sm
  loading: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  textDark: { type: Boolean, default: false },
  border: { type: Boolean, default: false },
  fitWidth: { type: Boolean, default: false },
})

defineEmits(['click'])

const bg = computed(() => {
  return props.contrast
    ? 'bg-contrast'
    : props.bgLight
      ? 'bg-gray-f6'
      : props.cancel
        ? 'bg-gray-a3'
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
      if (props.fitWidth) {
        return 'px-45 py-10'
      } else {
        return 'px-18 py-10'
      }
    default:
      return 'px-18 py-10'
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
