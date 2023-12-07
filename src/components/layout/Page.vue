<template>
  <div class="flex grow basis-full flex-row justify-start sm:basis-[600px] md:basis-[900px] xl:basis-[950px]">
    <div class="w-full max-w-[600px] pb-44 sm:pb-0 md:w-[600px]">
      <main>
        <div
          v-if="$slots['main-top']"
          class="sticky top-0 h-52 w-full max-w-[600px] bg-white transition-transform md:w-[600px]"
          :class="{ 'translate-y-[-100%]': !mainTopOpen }"
        >
          <slot name="main-top"></slot>
        </div>
        <div>
          <slot></slot>
        </div>
      </main>
    </div>
    <div class="hidden md:block md:w-[300px] xl:w-[350px]">
      <aside>
        <div ref="aside" class="pb-64" :class="{ 'pt-52': $slots['aside-top'] }" :style="asideStyle">
          <slot name="aside"></slot>
        </div>
        <div v-if="$slots['aside-top']" class="fixed top-0 h-52 bg-white md:w-[300px] xl:w-[350px]">
          <slot name="aside-top"></slot>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useEventListener, useInfiniteScroll, useWindowSize, useElementSize } from '@vueuse/core'

const props = defineProps({
  mainTopToggleDisabled: { type: Boolean, default: false },
  infinite: { type: Boolean, default: false },
  infiniteDistance: { type: Number, default: 100 },
})

const emits = defineEmits(['load'])

// main-top 滾動切換顯示/隱藏
const mainTopOpen = ref(true)

// 側邊欄滑到底黏在最下方不再繼續往上滑
const aside = ref(null)
const asidePosition = ref(null)
const asideTop = ref(0)
const asideStyle = computed(() => {
  const [position, top] = [asidePosition.value, asideTop.value]
  if (position) {
    return { position, [top > 0 ? 'bottom' : 'top']: 0 }
  }
  return {}
})
const { height: windowHeight } = useWindowSize()
const { height: asideHeight } = useElementSize(aside, undefined, { box: 'border-box' })
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
let prevScrollTop
function onScroll() {
  const scrollTop = document.documentElement.scrollTop

  if (!prevScrollTop) {
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
</script>
