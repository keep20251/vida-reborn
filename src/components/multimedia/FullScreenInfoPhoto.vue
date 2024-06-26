<template>
  <transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="transform opacity-0"
    enter-to-class="transform opacity-100"
    leave-active-class="transition duration-300 ease-out"
    leave-from-class="transform translate-y-0 opacity-100"
    leave-to-class="transform translate-y-100 opacity-0"
  >
    <Fullscreen v-if="isOpen">
      <template #closeBtn="{}">
        <div class="cursor-pointer" @click="close">
          <Icon name="closeWhite" size="15"></Icon>
        </div>
      </template>
      <template #content>
        <div class="flex h-full w-full items-center justify-center">
          <EncryptImage
            :src="img.url"
            :border-radius="10"
            :draggable="false"
            :relative="true"
            :fullHeight="true"
          ></EncryptImage>
        </div>
      </template>
    </Fullscreen>
  </transition>
</template>
<script setup>
import { computed, defineAsyncComponent } from 'vue'
import { storeToRefs } from 'pinia'
import { useFullscreenStore } from '@/store/fullscreen'
import EncryptImage from './EncryptImage.vue'

const Fullscreen = defineAsyncComponent(() => import('@/components/multimedia/base/Fullscreen.vue'))

const fullscreenStore = useFullscreenStore()
const { close } = fullscreenStore
const { mediaContainer, isActivated, activeName } = storeToRefs(fullscreenStore)

const isOpen = computed(() => activeName.value === 'single-photo' && isActivated.value)
const img = computed(() => mediaContainer.value.img)
</script>
