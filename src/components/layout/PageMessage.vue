<template>
  <div
    class="flex grow flex-row justify-start"
    :class="{ 'basis-[1000px]': wideEnough, 'basis-[540px]': !wideEnough, 'py-20': isDesktop }"
    :style="{ height: viewHeight }"
  >
    <div
      v-show="wideEnough || !messaging"
      class="h-full w-[384px] overflow-auto"
      :class="{
        'w-[384px]': wideEnough,
        'w-full max-w-xl': !wideEnough,
        'scrollbar-md mx-8 border-l border-l-gray-e5 py-20': isDesktop,
        'pb-60 pt-10': isMobile,
      }"
    >
      <slot></slot>
    </div>
    <div
      v-show="wideEnough || messaging"
      :class="{
        'w-[600px]': wideEnough,
        'w-full max-w-[600px]': !wideEnough,
        'mr-20 rounded-md border border-gray-e5 py-30 pl-20 pr-50 lg:pl-50': isDesktop,
        'px-20 py-10': isMobile,
      }"
    >
      <slot name="room"></slot>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useWindowSize } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/store/app'

defineProps({
  messaging: { type: Boolean, default: false },
})

const appStore = useAppStore()
const { isDesktop, isMobile } = storeToRefs(appStore)

const { width, height } = useWindowSize()
const wideEnough = computed(() => width.value > 1185)
const viewHeight = computed(() => height.value + 'px')
</script>
