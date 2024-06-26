<template>
  <BaseMedia class="baseMediaFullScreen" v-if="isFullPhotosActivated">
    <template v-slot:closeBtn="{}">
      <Icon name="closeWhite" size="15" @click="closeAndReset()"></Icon>
    </template>

    <template v-slot:content="{}">
      <div class="h-full w-full overflow-hidden rounded-inherit" ref="swiper">
        <div
          v-for="(img, i) in imgs"
          class="absolute top-0 h-full w-full"
          :class="{ 'will-change-transform': animIndex % 1 !== 0 }"
          :style="{
            transform: `translateX(${(i - animIndex) * 100}%)`,
          }"
          :key="i"
          :ref="collectRefs.bind(null, i)"
          @mousedown="handleDargImgMouseDown"
          @wheel="handleImgScroll"
          @touchstart.prevent="handleTouchStart"
          @touchmove.prevent="handleTouchMove"
          @touchend.prevent="handleTouchEnd"
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
        lock
        <LockMask v-if="isLock" :item="item" :meta="`${currIndex + 1} / ${imgs.length}`" isFullscreen></LockMask>
        prev
        <div
          v-if="isDesktop && imgs.length > 1 && currIndex >= 1"
          class="absolute left-0 top-0 flex h-full w-40 cursor-pointer items-center justify-end"
          @click.stop="prev(), resetGrag(), resetScale(), resetTouch()"
        >
          <div class="flex h-20 w-20 items-center justify-center rounded-full bg-gray-f6 opacity-60">
            <Icon name="back" size="16"></Icon>
          </div>
        </div>
        <!-- next -->
        <div
          v-if="isDesktop && imgs.length > 1 && currIndex < imgs.length - 1"
          class="absolute right-0 top-0 flex h-full w-40 cursor-pointer items-center justify-start"
          @click.stop="next(), resetGrag(), resetScale(), resetTouch()"
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
import { computed, defineAsyncComponent, ref, watch } from 'vue'
import { useSwipe as vuseSwip, whenever } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/store/app'
import { useFullscreenStore } from '@/store/fullscreen'
import LockMask from '@comp/multimedia/LockMask.vue'
import { useSwipe } from '@use/gesture/swipe'

const BaseMedia = defineAsyncComponent(() => import('./base/Fullscreen.vue'))

const fullscreenStore = useFullscreenStore()
const { close } = fullscreenStore
const { mediaContainer, isActivated, activeName } = storeToRefs(fullscreenStore)

const isFullPhotosActivated = computed(() => activeName.value === 'photos' && isActivated.value)

const appStore = useAppStore()
const { isDesktop } = storeToRefs(appStore)

const index = ref(0)
const item = computed(() => mediaContainer.value.item)
const currIndex = ref(index.value)
const imgs = computed(() => mediaContainer.value.item.url)

const isLock = computed(() => !mediaContainer.value.item.is_unlock && (imgs.value.length === 1 || animIndex.value > 0))

const swiper = ref(null)

const {
  index: animIndex,
  transitioning,
  prev,
  next,
  reset,
} = useSwipe(swiper, imgs, { initIndex: index.value, window: window })

whenever(
  () => transitioning.value === false,
  () => {
    currIndex.value = animIndex.value
  },
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

const baseMedia = ref(null)
const { isSwiping, lengthY: swipLengthY } = vuseSwip(swiper, { threshold: 0 })
const isSwipDownThenUp = ref(false)
const yMoveRange = ref(0)

// 監測是不是按住後先往下，不放開就往上滑
watch(swipLengthY, (nextY, beforeY) => (isSwipDownThenUp.value = nextY > beforeY))

const fd = (querySelector) => {
  const el = document.querySelector(querySelector)

  const addTransition = () => (el.style.transition = 'transform 0.3s ease')
  const removeTransition = () => (el.style.transition = 'unset')
  const setYtoTop = () => (el.style.transform = `translateY(0px)`)
  const setYtoBottom = () => (el.style.transform = `translateY(100%)`)
  const setClose = () => setTimeout(closeAndReset, 300)
  const setYChange = (y) => (el.style.transform = `translateY(${y}px)`)

  const close = () => {
    addTransition()
    setYtoBottom()
    setClose()
  }
  const reset = () => {
    addTransition()
    setYtoTop()
  }

  const transY = (y) => {
    removeTransition()
    setYChange(y)
  }

  return {
    addTransition,
    removeTransition,
    close,
    reset,
    transY,
  }
}

const swipElementClass = '.baseMediaFullScreen'
const swipTriggerRange = 100

whenever(
  () => isSwiping.value === false,
  () => {
    const dom = fd(swipElementClass)
    if (isSwipDownThenUp.value === true) {
      dom.reset()
    } else {
      if (yMoveRange.value > swipTriggerRange) {
        dom.close()
      } else {
        dom.reset()
      }
    }
  },
)

// 监听滑动距离，实现图片下滑关闭
whenever(
  () => swipLengthY.value,
  () => {
    if (swipLengthY.value > 0) return
    yMoveRange.value = Math.abs(swipLengthY.value)
    const dom = fd(swipElementClass)
    dom.transY(yMoveRange.value)
  },
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

function throttle(func, delay) {
  let timer = null
  return function (...args) {
    if (!timer) {
      timer = setTimeout(() => {
        func.apply(this, args)
        timer = null
      }, delay)
    }
  }
}

const originalScale = ref(1)
const scaleStep = ref(0.1)
const minScale = ref(0.5)
const maxScale = ref(2)
const scale = ref(originalScale.value)

const throttledChangeScale = throttle((isScaleUp, e) => {
  const nextScaleValue = isScaleUp
    ? Number(Math.min(scale.value + scaleStep.value, maxScale.value).toFixed(1))
    : Number(Math.max(scale.value - scaleStep.value, minScale.value).toFixed(1))

  scale.value = nextScaleValue

  const rect = targetElement.value.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  const xPercent = x / rect.width
  const yPercent = y / rect.height

  targetElement.value.style.transformOrigin = `${xPercent * 100}% ${yPercent * 100}%`
  targetElement.value.style.transform = `scale(${scale.value})`

  targetElement.value.style.transition = 'transform 0.3s ease'
}, 100) // 设置节流时间间隔，单位毫秒

const changeScale = (isScaleUp, e) => {
  throttledChangeScale(isScaleUp, e)
}

const changeScaleAsOriginPoint = (isScaleUp) => {
  const nextScaleValue = isScaleUp
    ? Number(Math.min(scale.value + scaleStep.value, maxScale.value).toFixed(1))
    : Number(Math.max(scale.value - scaleStep.value, minScale.value).toFixed(1))

  scale.value = nextScaleValue

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
  changeScale(e.deltaY < 0, e)
}

const closeAndReset = () => {
  resetTouch()
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

      changeScaleAsOriginPoint(true)
      break
    case 'ArrowDown':
      if (isLock.value) return
      changeScaleAsOriginPoint(false)
      break
  }
}

const bundKey = () => window.addEventListener('keydown', handleKey)
const unbindKey = () => window.removeEventListener('keydown', handleKey)

const scaleFactor = ref(1)
let initialDistance = 0
let lastScaleFactor = 1
let centerX = 0
let centerY = 0

const resetTouch = () => {
  initialDistance = 0
  lastScaleFactor = 1
  scaleFactor.value = 1
}

// 计算两个触摸点的距离
const calculateDistance = (touches) => {
  const dx = touches[0].pageX - touches[1].pageX
  const dy = touches[0].pageY - touches[1].pageY
  return Math.sqrt(dx * dx + dy * dy)
}

// 计算两个触摸点的中心位置
const calculateCenter = (touches) => {
  const x = (touches[0].pageX + touches[1].pageX) / 2
  const y = (touches[0].pageY + touches[1].pageY) / 2
  return { x, y }
}

const handleTouchStart = (e) => {
  const touches = Array.from(e.touches)
  // 两个触摸点
  if (touches.length === 2) {
    initialDistance = calculateDistance(touches)
    const center = calculateCenter(touches)
    centerX = center.x
    centerY = center.y
  }
}
const handleTouchMove = (e) => {
  const touches = Array.from(e.touches)
  let transformOrigin = ''
  if (touches.length === 2 && initialDistance > 0) {
    const currentDistance = calculateDistance(touches)
    scaleFactor.value = Math.min(2, Math.max(0.5, lastScaleFactor * (currentDistance / initialDistance)))

    const center = calculateCenter(touches)
    const deltaX = center.x - centerX
    const deltaY = center.y - centerY

    transformOrigin = `${deltaX}px ${deltaY}px`
    changeZoomByTouch({ scaleSize: scaleFactor.value, trensformOrigin: transformOrigin })
  }
}

const handleTouchEnd = (e) => {
  lastScaleFactor = scaleFactor.value
  initialDistance = 0
}

const changeZoomByTouch = ({ scaleSize, transformOrigin }) => {
  targetElement.value = imgElements.value[currIndex.value]
  if (!targetElement.value) return
  targetElement.value.style.transform = `scale(${scaleSize})`
  targetElement.value.style.transformOrigin = transformOrigin
}
</script>
