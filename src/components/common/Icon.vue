<template>
  <div class="inline-block text-center leading-normal" :class="[props.class, iconSize]">
    <component :is="component" :class="{ dropShadow }"></component>
  </div>
</template>
<script setup>
import LoadingIcon from '@/components/skeleton/LoadingIcon.vue'
import { computed, defineAsyncComponent } from 'vue'
import { useIconStore } from '@/store/icon'
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
const dropShadow = computed(() => (props.shadow ? 'drop-shadow-lg' : ''))

const { getModuleLoader } = useIconStore()

const component = computed(() =>
  defineAsyncComponent({
    loader: getModuleLoader(props.name),
    loadingComponent: LoadingIcon,
  }),
)
</script>
