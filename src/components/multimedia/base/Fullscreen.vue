<template>
  <div v-if="config.isActivated" :class="[fullScreenClass]">
    <div :class="[fullScreenBackClass]" @click="config.handleBackDrop"></div>
    <div :class="[fullScreenContentClass]">
      <component :is="baseComponent" :config="config">
        <template v-if="$slots.closeBtn" v-slot:closeBtn="{ config }">
          <slot name="closeBtn" :config="config"> </slot>
        </template>

        <template v-if="$slots.content" v-slot:content="{ config }">
          <slot name="content" ref="content" :config="config"> </slot>
        </template>
      </component>
    </div>
  </div>
</template>

<script setup>
import { computed, defineAsyncComponent, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/store/app'

const Desktop = defineAsyncComponent(() => import('./FullscreenDesktop.vue'))
const Mobile = defineAsyncComponent(() => import('./FullscreenMobile.vue'))

const { isDesktop } = storeToRefs(useAppStore())
const baseComponent = computed(() => (isDesktop.value ? Desktop : Mobile))

const props = defineProps({
  backdrop: { type: Boolean, default: true },
  showCloseBtn: { type: Boolean, default: undefined },
})

const config = ref({
  isActivated: true,
  backdrop: props?.backdrop ?? true,
  showCloseBtn: props?.showCloseBtn ?? true,
  close: async () => {
    config.value.isActivated = false
  },
  open: async () => {
    config.value.isActivated = true
  },
  handleBackDrop: () => {
    console.log('handleBackDrop')
    if (config.value.backdrop && config.value.isActivated) config.value.isActivated = false
  },
})

const fullScreenClass = computed(() => {
  let baseClass = 'fixed left-0 top-0 z-30 h-screen w-full flex items-center justify-center '
  baseClass += ' '
  return baseClass
})

const fullScreenBackClass = computed(() => {
  let baseClass = 'absolute top-0 left-0 h-full w-full '
  baseClass += ' '
  if (isDesktop.value) {
    baseClass += 'bg-black/50'
  } else {
    baseClass += 'bg-black '
  }
  return baseClass
})

const fullScreenContentClass = computed(() => {
  let baseClass = 'z-10 w-full'
  baseClass += ' '

  if (isDesktop.value) {
    // baseClass += 'bg-black/50'
  } else {
    // baseClass += 'bg-black '
    baseClass += 'h-[calc(100vh-20rem)]' // mobile center height
  }

  return baseClass
})
</script>

<style scoped></style>
