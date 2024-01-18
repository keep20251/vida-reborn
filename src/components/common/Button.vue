<template>
  <button
    class="leading-md flex h-36 w-full items-center justify-center rounded-full px-45 py-10 text-base font-bold text-white"
    :class="[bg]"
    :disabled="loading"
    @click="$emit('click')"
  >
    <div v-if="loading" class="flex flex-row space-x-4">
      <div class="h-6 w-6 animate-bounce rounded-full bg-white"></div>
      <div class="h-6 w-6 animate-bounce rounded-full bg-white [animation-delay:-.3s]"></div>
      <div class="h-6 w-6 animate-bounce rounded-full bg-white [animation-delay:-.5s]"></div>
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
</script>
