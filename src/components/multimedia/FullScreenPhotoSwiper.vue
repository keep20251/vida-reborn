<template>
  <BaseMedia>
    <template v-slot:closeBtn="{ config }">
      <Icon name="closeWhite" size="15" @click="config.close()"></Icon>
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
        >
          <EncryptImage
            :src="img.url"
            :border-radius="10"
            :active="i >= currIndex - 1 && i <= currIndex + 1"
            :draggable="false"
            :relative="true"
            @mouseenter="isMouseHoverImage = true"
            @mouseleave="isMouseHoverImage = false"
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
          @click.stop="prev(), resetGrag()"
        >
          <div class="flex h-20 w-20 items-center justify-center rounded-full bg-gray-f6 opacity-60">
            <Icon name="back" size="16"></Icon>
          </div>
        </div>
        <!-- next -->
        <div
          v-if="isDesktop && imgs.length > 1 && currIndex < imgs.length - 1"
          class="absolute right-0 top-0 flex h-full w-40 cursor-pointer items-center justify-start"
          @click.stop="next(), resetGrag()"
        >
          <div class="flex h-20 w-20 rotate-180 items-center justify-center rounded-full bg-gray-f6 opacity-60">
            <Icon name="back" size="16"></Icon>
          </div>
        </div>
      </div>
    </template>

    <template v-slot:dots="{}">
      <ul class="flex items-baseline justify-center space-x-5 p-5 text-white">
        <li
          class="px-4"
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
import { computed, defineAsyncComponent, reactive, ref, watch } from 'vue'
import { useMouse, useMousePressed, usePointer, useSwipe as vuseSwip, whenever } from '@vueuse/core'
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

const swiperImgs = ref([])
const swiperIndex = ref(0)

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
</script>
