<template>
  <div
    class="relative h-35 shrink-0 flex-grow cursor-pointer select-none appearance-none divide-solid rounded-2xl border-gray-cc bg-white px-20 py-12 text-sm font-normal not-italic leading-3 outline-none"
    :class="[outlinedStyle]"
  >
    <slot></slot>
  </div>
</template>
<script setup>
import { computed } from 'vue'

const props = defineProps({
  outlined: { type: Boolean, default: false },
  outlinedSize: { type: String, default: 'sm' },
})

const outlinedStyle = computed(() => {
  if (!props.outlined) return 'shadow-input'
  return {
    sm: 'shadow-active-sm',
    md: 'shadow-active-md',
    lg: 'shadow-active-lg',
  }[props.outlinedSize]
})
</script>
