<template>
  <div v-if="isOpen" class="fixed top-0 z-30 h-screen w-full" :style="closeBgStyle">
    <!-- 圖片滑動展示區 -->
    <div
      class="absolute top-0 h-full w-full"
      ref="swiper"
      :class="{ 'will-change-transform': closeIndex % 1 !== 0 }"
      :style="closeTransformStyle"
    >
      <div class="h-full w-full overflow-hidden" :style="gestureTransformStyle" ref="gesture">
        <div
          v-for="(imgInfo, i) in imgInfos"
          class="absolute top-0 h-full w-full"
          :class="{ 'will-change-transform': animIndex % 1 !== 0 }"
          :style="{ transform: `translateX(${(i - animIndex) * 100}%)` }"
          :key="i"
        >
          <EncryptImage
            :src="getImgUrl(imgInfo, i)"
            :border-radius="10"
            :active="i >= currIndex - 1 && i <= currIndex + 1"
            disable-draggable
          ></EncryptImage>
          <LockInfo v-if="isLock && (imgInfos.length === 1 || i > 0)" :item="feed"></LockInfo>
        </div>
      </div>
    </div>

    <!-- 索引 -->
    <div v-if="imgInfos.length > 1 && closeIndex === 1" class="absolute top-20 w-full select-none text-center">
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
    <div v-if="closeIndex === 1" class="absolute right-0 top-0 cursor-pointer p-20" @click="close">
      <Icon name="closeWhite" size="15"></Icon>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useEventListener, whenever } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/store/app'
import { useFullscreenPhotoStore } from '@/store/fullscreen-photo'
import LockInfo from '@comp/multimedia/LockInfo.vue'
import { useGesture } from '@use/gesture/gesture'
import { useSwipe } from '@use/gesture/swipe'
import { useRootScrollLock } from '@use/utils/scroll-lock'

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
} = useSwipe(swiper, imgInfos, { initIndex: currIndex.value, edgeDist: 40 })
whenever(
  () => !transitioning.value,
  () => (currIndex.value = animIndex.value),
)

const closeItems = ref([{}, {}, {}])
const {
  index: closeIndex,
  transitioning: closeTransitioning,
  reset: resetCloseSwipe,
  enable: enableCloseSwipe,
  disable: disableCloseSwipe,
} = useSwipe(swiper, closeItems, { isVerticle: true, initIndex: 1 })
whenever(
  () => !closeTransitioning.value,
  () => {
    if (closeIndex.value === 0 || closeIndex.value === 2) {
      close()
    }
  },
)
const closeBgStyle = computed(() => ({
  backgroundColor: isDesktop.value
    ? 'rgba(0, 0, 0, 0.7)'
    : `rgba(0, 0, 0, ${closeIndex.value <= 1 ? closeIndex.value : 2 - closeIndex.value})`,
}))
const closeTransformStyle = computed(() => ({ transform: `translateY(${(1 - closeIndex.value) * 100}%)` }))

const isLock = computed(() => feed.value.id !== undefined && !feed.value.is_unlock)

function getImgUrl(img, i) {
  if (!img.url_blur) return img.url
  if (!feed.value.is_unlock && (imgInfos.value.length === 1 || i > 0)) {
    return img.url_blur
  }
  return img.url
}

const gesture = ref(null)
const {
  scale,
  scaling,
  scaleCenterX,
  scaleCenterY,
  tapTransitioning,
  scaleUp,
  scaleDown,
  reset: resetGesture,
} = useGesture(gesture)
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
    enableCloseSwipe()
  } else {
    disableSwipe()
    disableCloseSwipe()
  }
})

useEventListener('keydown', (evt) => {
  if (!isOpen.value) return
  switch (evt.code) {
    case 'ArrowDown':
      scaleDown()
      break
    case 'ArrowUp':
      scaleUp()
      break
    case 'ArrowLeft':
      prev()
      break
    case 'ArrowRight':
      next()
      break
  }
})

whenever(isOpen, () => {
  resetSwipe(currIndex.value)
  resetCloseSwipe(1)
  resetGesture()
})

const { lock, unlock } = useRootScrollLock()
watch(isOpen, (v) => (v ? lock() : unlock()))
</script>
