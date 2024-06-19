<template>
  <div :class="[fullScreenClass]" ref="fullScreenContainer">
    <div :class="[fullScreenBackClass]" @click="handleBackDrop"></div>
    <div :class="[fullScreenContentClass]">
      <component :is="baseComponent" :config="config">
        <template v-if="$slots.closeBtn" v-slot:closeBtn="{ config }">
          <slot name="closeBtn" :config="config"> </slot>
        </template>

        <template v-if="$slots.content" v-slot:content="{ config }">
          <slot name="content" :config="config"> </slot>
        </template>

        <template v-if="$slots.dots" v-slot:dots="{ config }">
          <slot name="dots" :config="config"> </slot>
        </template>
      </component>
    </div>
  </div>
</template>

<script setup>
import { computed, defineAsyncComponent, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/store/app'
import { useFullscreenStore } from '@/store/fullscreen'

const Desktop = defineAsyncComponent(() => import('./FullscreenDesktop.vue'))
const Mobile = defineAsyncComponent(() => import('./FullscreenMobile.vue'))

const { isDesktop } = storeToRefs(useAppStore())
const baseComponent = computed(() => (isDesktop.value ? Desktop : Mobile))

const { open, close, handleBackDrop } = useFullscreenStore()
const { isActivated, backdrop, showCloseBtn, mediaList, mediaCurrentIndex } = storeToRefs(useFullscreenStore())

const fullScreenContainer = ref(null)

const config = computed(() => ({
  isActivated: isActivated.value,
  backdrop: backdrop.value,
  showCloseBtn: showCloseBtn.value,
  mediaList: mediaList.value,
  mediaCurrentIndex: mediaCurrentIndex.value,
  close: close,
  open: open,
}))

const fullScreenClass = computed(() => {
  let baseClass = 'fixed left-0 top-0 z-30 h-screen w-full flex  justify-center '
  baseClass += ' '

  if (isDesktop.value) {
    baseClass += 'items-center'
  } else {
    const rect = fullScreenContainer.value?.getBoundingClientRect()
    if (rect) {
      const { width } = rect
      if (width < 414) {
        // extra small
        baseClass += 'items-start '
      } else {
        baseClass += 'items-center '
      }
    }
  }
  return baseClass
})

const fullScreenBackClass = computed(() => {
  let baseClass = 'absolute top-0 left-0 h-full w-full '
  baseClass += ' '
  if (isDesktop.value) {
    baseClass += 'bg-black/80'
  } else {
    baseClass += 'bg-black '
  }
  return baseClass
})

const fullScreenContentClass = computed(() => {
  let baseClass = 'z-10  '
  baseClass += ' '

  if (isDesktop.value) {
    baseClass += 'w-full h-full'

    // baseClass += 'bg-black/50'
  } else {
    baseClass += ' h-full w-full' // mobile center height
  }

  return baseClass
})
</script>

<style scoped></style>
