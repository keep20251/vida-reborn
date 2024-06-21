<template>
  <BaseMedia>
    <template v-slot:closeBtn="{}">
      <Icon name="closeWhite" size="15" @click="closeAndReset()"></Icon>
    </template>

    <template v-slot:content="{}">
      <div class="relative h-full w-full overflow-hidden rounded-inherit" ref="swiper">
        <div
          v-for="(img, i) in imgs"
          class="absolute top-0 h-full w-full"
          :class="{ 'will-change-transform': animIndex % 1 !== 0 }"
          :style="{ transform: `translateX(${(i - animIndex) * 100}%)` }"
          :key="i"
          :ref="collectRefs.bind(null, i)"
          @mousedown="handleDargImgMouseDown"
          @wheel="handleImgScroll"
        >
          <EncryptImage
            :src="img.url"
            :border-radius="10"
            :active="i >= currIndex - 1 && i <= currIndex + 1"
            :draggable="false"
            :relative="true"
            :fullHeight="true"
          ></EncryptImage>
        </div>

        <!-- page -->
        <div v-if="imgs.length > 1" class="absolute right-[calc(50%-1rem)] top-20 flex select-none space-x-5">
          <span class="text-base tracking-wide text-white">{{ `${currIndex + 1} / ${imgs.length}` }}</span>
        </div>
        <!-- lock -->
        <LockMask v-if="isLock" :item="item" :meta="`${currIndex + 1} / ${imgs.length}`" isFullscreen></LockMask>
        <!-- prev -->
        <div
          v-if="isDesktop && imgs.length > 1 && currIndex >= 1"
          class="absolute left-0 top-0 flex h-full w-40 cursor-pointer items-center justify-end"
          @click.stop="prev(), resetGrag(), resetScale()"
        >
          <div class="flex h-20 w-20 items-center justify-center rounded-full bg-gray-f6 opacity-60">
            <Icon name="back" size="16"></Icon>
          </div>
        </div>
        <!-- next -->
        <div
          v-if="isDesktop && imgs.length > 1 && currIndex < imgs.length - 1"
          class="absolute right-0 top-0 flex h-full w-40 cursor-pointer items-center justify-start"
          @click.stop="next(), resetGrag(), resetScale()"
        >
          <div class="flex h-20 w-20 rotate-180 items-center justify-center rounded-full bg-gray-f6 opacity-60">
            <Icon name="back" size="16"></Icon>
          </div>
        </div>
      </div>
    </template>
  </BaseMedia>
</template>

<script setup>
import { computed, defineAsyncComponent, ref } from 'vue'
import { useSwipe as vuseSwip, whenever } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/store/app'
import { useFullscreenStore } from '@/store/fullscreen'
import LockMask from '@comp/multimedia/LockMask.vue'
import { useSwipe } from '@use/gesture/swipe'

const BaseMedia = defineAsyncComponent(() => import('./base/Fullscreen.vue'))

const fullscreenStore = useFullscreenStore()
const { close } = fullscreenStore
const { mediaContainer, isActivated } = storeToRefs(fullscreenStore)

const appStore = useAppStore()
const { isDesktop } = storeToRefs(appStore)

const index = ref(0)
const item = computed(() => mediaContainer.value.item)
const currIndex = ref(index.value)
const imgs = computed(() => mediaContainer.value.item.url)

const isLock = computed(() => !mediaContainer.value.item.is_unlock && (imgs.value.length === 1 || animIndex.value > 0))

const swiper = ref(null)

const { index: animIndex, transitioning, prev, next, reset } = useSwipe(swiper, imgs, { initIndex: index.value })

whenever(
  () => transitioning.value === false,
  () => (currIndex.value = animIndex.value),
)
whenever(
  () => isActivated.value,
  () => {
    const targetIndex = mediaContainer.value.mediaCurrentIndex
    reset(targetIndex)
    index.value = targetIndex
    currIndex.value = targetIndex
    bundKey()
  },
)

whenever(
  () => !isActivated.value,
  () => {
    reset()
    index.value = 0
    currIndex.value = 0
    imgElements.value = []
    targetElement.value = null
    unbindKey()
  },
)

const { isSwiping, direction } = vuseSwip(swiper)
whenever(
  () => isSwiping.value && direction.value === 'down',
  () => close(),
)

const imgElements = ref([])

const collectRefs = (index, el) => {
  if (el) imgElements.value[index] = el
}

const [pos1, pos2, pos3, pos4] = [ref(0), ref(0), ref(0), ref(0)]
const targetElement = ref(null)

const handleDargImgMouseDown = (e) => {
  e = e || window.event
  e.preventDefault()
  pos3.value = e.clientX
  pos4.value = e.clientY
  targetElement.value = e.target
  targetElement.value.onmouseup = closeDragElement
  targetElement.value.onmousemove = handleDragMove
}

const closeDragElement = () => {
  targetElement.value.onmouseup = null
  targetElement.value.onmousemove = null
}

const handleDragMove = (e) => {
  e = e || window.event
  e.preventDefault()
  pos1.value = pos3.value - e.clientX
  pos2.value = pos4.value - e.clientY
  pos3.value = e.clientX
  pos4.value = e.clientY
  targetElement.value.style.top = targetElement.value.offsetTop - pos2.value + 'px'
  targetElement.value.style.left = targetElement.value.offsetLeft - pos1.value + 'px'
}

const resetGrag = () => {
  if (!targetElement.value) return
  targetElement.value.onmouseup = null
  targetElement.value.onmousemove = null
  pos1.value = 0
  pos2.value = 0
  pos3.value = 0
  pos4.value = 0
  targetElement.value.style.top = 0
  targetElement.value.style.left = 0
}

const originalScale = ref(1)
const scaleStep = ref(0.1)
const minScale = ref(0.5)
const maxScale = ref(2)
const scale = ref(originalScale.value)

const changeScale = (isScaleUp) => {
  if (isScaleUp) {
    scale.value = Math.min(scale.value + scaleStep.value, maxScale.value)
  } else {
    scale.value = Math.max(scale.value - scaleStep.value, minScale.value)
  }
  targetElement.value.style.transform = `scale(${scale.value})`
}

const resetScale = () => {
  originalScale.value = 1
  scaleStep.value = 0.1
  minScale.value = 0.5
  maxScale.value = 2
  scale.value = originalScale.value

  if (!targetElement.value) return
  targetElement.value.style.transform = `scale(${scale.value})`
  targetElement.value.style.left = 0
  targetElement.value.style.top = 0
}

const handleImgScroll = (e) => {
  e.preventDefault()
  if (e.target.tagName !== 'IMG') return

  e = e || window.event
  e.preventDefault()
  targetElement.value = e.target
  changeScale(e.deltaY < 0)
}

const closeAndReset = () => {
  resetGrag()
  resetScale()
  close()
}

const handleKey = (e) => {
  targetElement.value = imgElements.value[currIndex.value]

  switch (e.key) {
    case 'Escape':
      closeAndReset()
      break
    case 'ArrowLeft':
      prev()
      break
    case 'ArrowRight':
      next()
      break
    case 'ArrowUp':
      if (isLock.value) return
      changeScale(true)
      break
    case 'ArrowDown':
      if (isLock.value) return
      changeScale(false)
      break
  }
}

const bundKey = () => window.addEventListener('keydown', handleKey)
const unbindKey = () => window.removeEventListener('keydown', handleKey)
</script>
