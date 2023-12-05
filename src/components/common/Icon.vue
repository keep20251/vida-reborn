<template>
  <component :is="component" :class="[iconSize, props.class, dropShadow]"></component>
</template>
<script setup>
import { computed } from 'vue'
import { iconSet } from '@/utils/icon-set'
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
})

const iconSize = computed(() => sizes[props.size])
const component = computed(() => iconSet[props.name])
const dropShadow = computed(() => (props.shadow ? 'drop-shadow-lg' : ''))
</script>
