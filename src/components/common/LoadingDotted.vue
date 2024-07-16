<template>
  <div class="inline-block text-center leading-normal" :class="[iconSize]">
    <DotLoadingSVG></DotLoadingSVG>
  </div>
</template>
<script setup>
import { computed } from 'vue'
import { sizes } from '@/utils/icon'
import DotLoadingSVG from '@/assets/icons/function/dot-loading.svg'

const props = defineProps({
  size: {
    type: [String, Number],
    default: '16',
  },
})

const iconSize = computed(() => sizes[props.size])
</script>
<style scoped lang="scss">
@keyframes fade {
  0%,
  100% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
}
::v-deep(.circular-dot) {
  animation: fade 1s infinite;
}
</style>
