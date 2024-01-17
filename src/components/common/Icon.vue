<template>
  <div class="flex items-center justify-center text-center leading-normal" :class="[props.class, iconSize]">
    <component :is="component" :class="{ dropShadow }"></component>
  </div>
</template>
<script setup>
import LoadingIcon from '@/components/skeleton/LoadingIcon.vue'
import { computed, defineAsyncComponent } from 'vue'
import { sizes, getModuleLoader } from '@/utils/icon'

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
    type: [String, Number],
    default: '16',
  },
})

const iconSize = computed(() => sizes[props.size])
const dropShadow = computed(() => (props.shadow ? 'drop-shadow-lg' : ''))

const component = computed(() =>
  defineAsyncComponent({
    loader: getModuleLoader(props.name),
    loadingComponent: LoadingIcon,
  }),
)
</script>
