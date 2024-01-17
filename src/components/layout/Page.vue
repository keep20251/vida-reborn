<template>
  <div class="flex grow basis-full flex-row justify-start sm:basis-[600px] md:basis-[860px] xl:basis-[880px]">
    <div class="w-full max-w-[540px] px-20 pb-60 sm:pb-0 md:mr-20 md:w-[540px] xl:mr-40">
      <main>
        <div
          v-if="$slots['main-top']"
          class="fixed top-0 z-10 h-52 w-full max-w-[500px] overflow-hidden bg-white transition-transform md:w-[500px]"
          :class="{ 'translate-y-[-100%]': !mainTopOpen }"
        >
          <slot name="main-top"></slot>
        </div>
        <div ref="main" :class="{ 'pt-52': $slots['main-top'] }">
          <slot></slot>
        </div>
      </main>
    </div>
    <div class="hidden md:block md:w-[300px]">
      <aside>
        <div v-if="$slots['aside-top']" class="fixed top-0 z-10 h-52 overflow-hidden bg-white md:w-[300px]">
          <slot name="aside-top"></slot>
        </div>
        <div ref="aside" class="pb-64 md:w-[300px]" :class="{ 'pt-52': $slots['aside-top'] }" :style="asideStyle">
          <slot name="aside"></slot>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onActivated, onDeactivated } from 'vue'
import { useEventListener, useInfiniteScroll, useWindowSize, useElementSize } from '@vueuse/core'

const props = defineProps({
  mainTopToggleDisabled: { type: Boolean, default: false },
  infinite: { type: Boolean, default: false },
  infiniteDistance: { type: Number, default: 100 },
})

const emits = defineEmits(['load'])

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
watch(asideHeight, () => {
  const diff = asideHeight.value - windowHeight.value
  if (diff <= 0) {
    asidePosition.value = 'fixed'
    asideTop.value = 0
  } else {
    asideTop.value = diff
  }
})

// 滾動事件是偵測最頂層 html
let prevScrollTop = 0
let lockOnScroll = false
function onScroll() {
  if (lockOnScroll) {
    return
  }

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

onMounted(() => {
  // 頂層 scroll
  useEventListener('scroll', onScroll)

  // 無限滑動通知
  if (props.infinite) {
    useInfiniteScroll(window, () => emits('load'), { distance: props.infiniteDistance })
  }
})

// 切換時要 scroll 回原本位置
onActivated(() => {
  window.scrollTo(0, prevScrollTop)
  lockOnScroll = false
})
onDeactivated(() => {
  lockOnScroll = true
})
</script>
