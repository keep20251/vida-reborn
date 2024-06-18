<template>
  <BaseMedia>
    <template v-slot:closeBtn="{ config }">
      <button class="text-white" @click="config.close()">x</button>
    </template>

    <template v-slot:content="{}">
      <PhotoSwiper
        v-if="mediaType == 'image'"
        :item="mediaContainer.item"
        stat
        :index="swiperIndex"
        @update:currIndex="handleIndexChange"
      ></PhotoSwiper>
    </template>

    <template v-slot:dots="{}">
      <ul class="flex items-baseline justify-center space-x-5 p-5 text-white">
        <li
          @click="handleSelectItem(itemIndex)"
          class="m-2 cursor-pointer p-2"
          :class="{ 'text-blue-500': swiperIndex === itemIndex, 'text-xl': swiperIndex === itemIndex }"
          v-for="(item, itemIndex) in swiperImgs"
          :key="itemIndex"
        >
          <div>。</div>
        </li>
      </ul>
    </template>
  </BaseMedia>
</template>

<script setup>
import { computed, defineAsyncComponent, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/store/app'
import { useFullscreenStore } from '@/store/fullscreen'

const BaseMedia = defineAsyncComponent(() => import('./base/Fullscreen.vue'))

const PhotoSwiper = defineAsyncComponent(() => import('./PhotoSwiper.vue'))

const { mediaType, mediaContainer } = storeToRefs(useFullscreenStore())

const { isDesktop } = storeToRefs(useAppStore())

const swiperImgs = ref([])
const swiperIndex = ref(0)

const handleIndexChange = (params) => {
  console.log('handleIndexChange', params)
  const { index, total, imgs, img } = params
  console.log('handleIndexChange', index, total, imgs, img)
  swiperImgs.value = imgs
  swiperIndex.value = index
}
const handleSelectItem = (index) => {
  console.log('handleSelectItem', index)
  swiperIndex.value = index
  console.log('swiperIndex.value', swiperIndex.value)
}
</script>
