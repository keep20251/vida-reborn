<template>
  <component :is="component" :class="[iconSize, props.class, dropShadow]"></component>
</template>
<script setup>
import { computed } from 'vue'
import { IconSet } from '@/constant'
import { sizes } from '@/utils/icon-size'

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
    type: Number,
    default: 16,
  },
  set: {
    type: String,
    default: 'fantasi',
  },
})

const iconSize = computed(() => sizes[props.size])
const iconSet = computed(() => IconSet[props.set])
const component = computed(() => iconSet.value[props.name])
const dropShadow = computed(() => (props.shadow ? 'drop-shadow-lg' : ''))
</script>
