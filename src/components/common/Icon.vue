<template>
  <component :is="component" :class="[props.class, dropShadow]"></component>
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
const dropShadow = computed(() => (props.shadow ? 'drop-shadow-lg' : ''))
</script>
