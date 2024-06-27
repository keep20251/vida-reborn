<template>
  <div v-if="isOpen" class="fixed top-0 z-30 h-screen w-full bg-black" :class="{ 'bg-opacity-70': isDesktop }">
    <!-- 圖片滑動展示區 -->
    <div class="absolute top-0 h-full w-full" ref="swiper">
      <div class="h-full w-full overflow-hidden" :style="gestureTransformStyle" ref="gesture">
        <div
          v-for="(imgInfo, i) in imgInfos"
          class="absolute top-0 h-full w-full"
          :class="{ 'will-change-transform': animIndex % 1 !== 0 }"
          :style="{ transform: `translateX(${(i - animIndex) * 100}%)` }"
          :key="i"
        >
          <EncryptImage
            :src="imgInfo.url"
            :border-radius="10"
            :active="i >= currIndex - 1 && i <= currIndex + 1"
            disable-draggable
          ></EncryptImage>
        </div>
      </div>
      <LockMask v-if="isLock" :item="feed" fullscreen></LockMask>
    </div>

    <!-- 索引 -->
    <div v-if="imgInfos.length > 1" class="absolute top-20 w-full select-none text-center">
      <span class="text-base text-white">{{ `${currIndex + 1} / ${imgInfos.length}` }}</span>
    </div>

    <!-- 前一張按鈕 -->
    <div
      v-if="isDesktop && showFeature && imgInfos.length > 1 && currIndex >= 1"
      class="absolute left-0 flex h-full w-40 cursor-pointer items-center justify-end"
      @click.stop="prev"
    >
      <div class="flex h-20 w-20 items-center justify-center rounded-full bg-gray-f6 opacity-60">
        <Icon name="back" size="16"></Icon>
      </div>
    </div>

    <!-- 後一張按鈕 -->
    <div
      v-if="isDesktop && showFeature && imgInfos.length > 1 && currIndex < imgInfos.length - 1"
      class="absolute right-0 flex h-full w-40 cursor-pointer items-center justify-start"
      @click.stop="next"
    >
      <div class="flex h-20 w-20 rotate-180 items-center justify-center rounded-full bg-gray-f6 opacity-60">
        <Icon name="back" size="16"></Icon>
      </div>
    </div>

    <!-- 關閉 -->
    <div class="absolute right-0 top-0 cursor-pointer p-20" @click="close">
      <Icon name="closeWhite" size="15"></Icon>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { syncRef, useScrollLock, whenever } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/store/app'
import { useFullscreenPhotoStore } from '@/store/fullscreen-photo'
import LockMask from '@comp/multimedia/LockMask.vue'
import { useGesture } from '@use/gesture/gesture'
import { useSwipe } from '@use/gesture/swipe'

const appStore = useAppStore()
const { isDesktop } = storeToRefs(appStore)

const fullscreenPhotoStore = useFullscreenPhotoStore()
const { feed, currIndex, isOpen } = storeToRefs(fullscreenPhotoStore)
const { close } = fullscreenPhotoStore

const imgInfos = computed(() => feed.value.url)

const swiper = ref(null)
const {
  index: animIndex,
  transitioning,
  prev,
  next,
  reset: resetSwipe,
  enable: enableSwipe,
  disable: disableSwipe,
} = useSwipe(swiper, imgInfos, { initIndex: currIndex.value })
whenever(
  () => !transitioning.value,
  () => (currIndex.value = animIndex.value),
)

const isLock = computed(
  () => feed.value.id !== undefined && !feed.value.is_unlock && (imgInfos.value.length === 1 || animIndex.value > 0),
)

const gesture = ref(null)
const { scale, scaling, scaleCenterX, scaleCenterY, tapTransitioning, reset: resetGesture } = useGesture(gesture)
const gestureTransformStyle = computed(() => ({
  transition: tapTransitioning.value && !scaling.value ? 'transform 0.3s ease-out' : '',
  transform: `scale(${scale.value})`,
  transformOrigin:
    scaleCenterX.value === null && scaleCenterY.value === null ? '' : `${scaleCenterX.value}px ${scaleCenterY.value}px`,
}))
const showFeature = computed(() => scale.value === 1)
watch(scale, (v) => {
  if (v === 1) {
    enableSwipe()
  } else {
    disableSwipe()
  }
})

whenever(isOpen, () => {
  resetSwipe(currIndex.value)
  resetGesture()
})

const isLocked = useScrollLock(window)
syncRef(isOpen, isLocked, { direction: 'ltr' })
</script>
