<template>
  <div class="h-8 w-full rounded-full bg-slate-600">
    <div class="h-8 rounded-full bg-primary" :class="{ height }" :style="{ width }"></div>
  </div>
</template>
<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: { type: Number, default: 0 },
  size: { type: String, default: 'lg' }, // lg | md | sm
})

const height = computed(() => {
  switch (props.size) {
    case 'md':
      return 'h-8'
    case 'sm':
      return 'h-6'
    case 'lg':
    default:
      return 'h-10'
  }
})

const width = computed(() => props.modelValue + '%')
</script>
