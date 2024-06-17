<template>
  <div :class="[fullScreenClass]">
    <Desktop v-if="isDesktop" :config="config">
      <!-- DESC: pase the closeBtn slot to the [FullscreenDesktop] component -->
      <template v-if="$slots.closeBtn" v-slot:closeBtn="{ config }">
        <slot name="closeBtn" :config="config"> </slot>
      </template>

      <template v-if="$slots.content" v-slot:content="{ config }">
        <slot name="content" :config="config"> </slot>
      </template>
    </Desktop>
    <Mobile v-else :config="config">
      <!-- DESC: pase the closeBtn slot to the [FullscreenMobile] component -->
      <template v-if="$slots.closeBtn" v-slot:closeBtn="{ config }">
        <slot name="closeBtn" :config="config"> </slot>
      </template>

      <template v-if="$slots.content" v-slot:content="{ config }">
        <slot name="content" :config="config"> </slot>
      </template>
    </Mobile>
  </div>
</template>

<script setup>
import { computed, defineAsyncComponent, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/store/app'

const Desktop = defineAsyncComponent(() => import('./FullscreenDesktop.vue'))
const Mobile = defineAsyncComponent(() => import('./FullscreenMobile.vue'))

const config = ref({
  isActivated: false,
  backDrop: true,
  close: async () => {
    console.log('closeAction')
    if (config.value.backDrop) config.value.isActivated = false
  },
  open: async () => {
    console.log('openAction')

    config.value.isActivated = true
  },
})

const { isDesktop } = storeToRefs(useAppStore())

const fullScreenClass = computed(() => {
  let baseClass = 'fixed left-0 top-0 z-50 h-screen w-full'
  baseClass += ' '
  if (isDesktop.value) {
    baseClass += 'bg-black/50'
  } else {
    baseClass += 'bg-black/50 '
  }

  return baseClass
})
</script>

<style scoped></style>
