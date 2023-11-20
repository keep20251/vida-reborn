<template>
  <component class="icon" :is="component" :style="style" :class="[props.class, `icon-size-${props.size}`]"></component>
</template>
<script setup>
import { computed } from 'vue'
import { IconSet } from '@/constant'

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  class: {
    type: String,
    default: '',
  },
  shadow: {
    type: Boolean,
    default: false,
  },
  size: {
    type: String,
    default: '16',
  },
  set: {
    type: String,
    default: 'fantasi',
  },
})

const iconSet = computed(() => IconSet[props.set])
const component = computed(() => iconSet.value[props.name])

const style = computed(() => {
  return props.shadow ? { filter: 'drop-shadow(0rem 0rem 0.5rem rgba(0, 0, 0, 0.3))' } : {}
})
</script>
