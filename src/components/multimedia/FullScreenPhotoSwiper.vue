<template>
  <BaseMedia :backdrop="setupConfig.backdrop" :showCloseBtn="setupConfig.showCloseBtn">
    <template v-slot:closeBtn="{ config }">
      <button @click="config.close()">x</button>
    </template>

    <template v-slot:content="{ config }">
      <div class="w-full" @click="console.log('content')">
        <div class="p-5">1</div>
        <div>2</div>
        <div>3</div>
        <pre>
          {{ config }}
        </pre>
      </div>
    </template>
  </BaseMedia>
</template>

<script setup>
import { computed, defineAsyncComponent, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/store/app'

const BaseMedia = defineAsyncComponent(() => import('./base/Fullscreen.vue'))

const { isDesktop } = storeToRefs(useAppStore())
const setupConfig = computed(() => {
  const _config = {}
  if (isDesktop.value) {
    _config.backdrop = true
    _config.showCloseBtn = false
  } else {
    _config.backdrop = false
    _config.showCloseBtn = true
  }
  return _config
})
</script>
