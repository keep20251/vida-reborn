<template>
  <!--
    min-w-0 沒設的話底下有文字區塊使用 line-clamp-${count} 做換行省略的可能都會跑版
    參考連結: https://css-tricks.com/flexbox-truncated-text/
  -->
  <div class="flex min-w-0 grow basis-full flex-row justify-start sm:basis-[540px] md:basis-[860px] xl:basis-[880px]">
    <div class="w-full max-w-[540px] px-20 pb-60 sm:pb-0 md:mr-20 md:w-[540px] xl:mr-40">
      <main>
        <!-- main top -->
        <div
          v-if="$slots['main-top']"
          class="fixed z-10 -ml-20 max-w-[540px] overflow-hidden bg-white px-20 transition-transform"
          :class="{
            'w-full': isMobile,
            'w-[calc(100%-60px)]': isDesktop,
            'h-44': isMobile,
            'h-52': isDesktop,
            'top-52': $slots['app-top'],
            'translate-y-[-100%]': !mainTopOpen,
          }"
        >
          <slot name="main-top"></slot>
        </div>

        <!-- app-top -->
        <div
          v-if="$slots['app-top']"
          class="fixed top-0 z-10 -ml-20 h-52 max-w-[540px] overflow-hidden bg-white px-20 py-9"
          :class="{
            'w-full': isMobile,
            'w-[calc(100%-60px)]': isDesktop,
          }"
        >
          <slot name="app-top"></slot>
        </div>

        <!-- main -->
        <div
          ref="main"
          :class="{
            'pt-44': isMobile && $slots['main-top'] && !$slots['app-top'],
            'pt-52':
              (isDesktop &&
                (($slots['main-top'] && !$slots['app-top']) || (!$slots['main-top'] && $slots['app-top']))) ||
              (isMobile && !$slots['main-top'] && $slots['app-top']),
            'pt-96': isMobile && $slots['app-top'] && $slots['main-top'],
            'pt-[6.5rem]': isDesktop && $slots['app-top'] && $slots['main-top'],
          }"
        >
          <slot></slot>
        </div>
      </main>
    </div>
    <div v-if="isDesktop" class="hidden md:block md:w-[300px]">
      <aside>
        <!-- aside top -->
        <div v-if="$slots['aside-top']" class="fixed top-0 z-10 h-52 overflow-hidden bg-white md:w-[300px]">
          <slot name="aside-top"></slot>
        </div>

        <!-- aside -->
        <div ref="aside" class="pb-64 md:w-[300px]" :class="{ 'pt-52': $slots['aside-top'] }" :style="asideStyle">
          <slot name="aside"></slot>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { computed, onActivated, onDeactivated, onMounted, ref, watch } from 'vue'
import { useElementSize, useEventListener, useInfiniteScroll, useWindowSize } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/store/app'

const props = defineProps({
  mainTopToggleDisabled: { type: Boolean, default: false },
  infinite: { type: Boolean, default: false },
  infiniteDistance: { type: Number, default: 100 },
  infiniteInterval: { type: Number, default: 1000 },
})

const emits = defineEmits(['load'])

const appStore = useAppStore()
const { isDesktop, isMobile } = storeToRefs(appStore)

const main = ref(null)
const aside = ref(null)
const { height: windowHeight } = useWindowSize()
const { height: mainHeight } = useElementSize(main, undefined, { box: 'border-box' })
const { height: asideHeight } = useElementSize(aside, undefined, { box: 'border-box' })

// main-top 滾動切換顯示/隱藏
const mainTopOpen = ref(true)

// 側邊欄滑到底黏在最下方不再繼續往上滑
const asidePosition = ref(null)
const asideTop = ref(0)
const asideStyle = computed(() => {
  const isAsideHeightLtMain = asideHeight.value < mainHeight.value
  const [position, top] = [asidePosition.value, asideTop.value]
  if (isAsideHeightLtMain && position) {
    return { position, [top > 0 ? 'bottom' : 'top']: 0 }
  }
  return {}
})
function onAsideHeight() {
  const diff = asideHeight.value - windowHeight.value
  if (diff <= 0) {
    asidePosition.value = 'fixed'
    asideTop.value = 0
  } else {
    asideTop.value = diff
  }
}

// 滾動事件是偵測最頂層 html
let prevScrollTop = 0
function onScroll() {
  const scrollTop = document.documentElement.scrollTop

  if (prevScrollTop === 0) {
    prevScrollTop = scrollTop
    return
  }

  const diff = scrollTop - prevScrollTop
  // 下滑
  if (diff > 0) {
    if (scrollTop > 100 && !props.mainTopToggleDisabled) {
      mainTopOpen.value = false
    }
    if (asideTop.value > 0 && asidePosition.value === null && scrollTop >= asideTop.value) {
      asidePosition.value = 'fixed'
    }
  }
  // 上滑
  else if (diff < 0) {
    if (!mainTopOpen.value) {
      mainTopOpen.value = true
    }
    if (asideTop.value > 0 && asidePosition.value !== null && scrollTop < asideTop.value) {
      asidePosition.value = null
    }
  }
  prevScrollTop = scrollTop
}

let active
let stopOnScroll
let stopWatchAsideHeight
onMounted(() => {
  // 無限滑動通知
  if (props.infinite) {
    useInfiniteScroll(
      window,
      () => {
        if (!active) return
        emits('load')
      },
      {
        distance: props.infiniteDistance,
        interval: props.infiniteInterval,
      },
    )
  }
})
onActivated(() => {
  active = true

  window.scrollTo(0, prevScrollTop)

  stopOnScroll = useEventListener('scroll', onScroll)
  stopWatchAsideHeight = watch(asideHeight, onAsideHeight)
})
onDeactivated(() => {
  active = false

  stopOnScroll()
  stopWatchAsideHeight()
})
</script>
