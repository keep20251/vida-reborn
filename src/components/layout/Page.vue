<template>
  <div
    class="flex grow basis-full flex-row justify-start overflow-auto sm:basis-[600px] md:basis-[900px] xl:basis-[950px]"
    ref="page"
    @scroll="onScroll"
  >
    <div class="w-full max-w-[600px] md:w-[600px]">
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
        <div ref="aside" :class="{ 'pt-52': $slots['aside-top'] }" :style="asideStyle">
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
import { ref, computed } from 'vue'
import { useInfiniteScroll, useResizeObserver, useWindowSize } from '@vueuse/core'

const props = defineProps({
  infinite: { type: Boolean, default: false },
  infiniteDistance: { type: Number, default: 100 },
})

const emits = defineEmits(['load'])

const page = ref(null)
const aside = ref(null)

// 無限滑動通知
if (props.infinite) {
  useInfiniteScroll(
    page,
    () => {
      emits('load')
    },
    { distance: props.infiniteDistance },
  )
}

// main-top 滾動切換顯示/隱藏
const mainTopOpen = ref(true)

// 側邊欄滑到底黏在最下方不再繼續往上滑
const asidePosition = ref(null)
const asideTop = ref(0)
const asideStyle = computed(() => {
  const [position, top] = [asidePosition.value, asideTop.value]
  if (position) {
    if (top > 0) {
      return { position, bottom: 0 }
    } else {
      return { position, top: 0 }
    }
  }
  return {}
})
const { height: windowHeight } = useWindowSize()
useResizeObserver(aside, (entries) => {
  const entry = entries[0]
  const { height } = entry.contentRect
  const diff = height - windowHeight.value
  if (diff <= 0) {
    asidePosition.value = 'fixed'
  } else {
    asideTop.value = diff
  }
})

let prevScrollTop
function onScroll({ target: { scrollTop } }) {
  if (!prevScrollTop) {
    prevScrollTop = scrollTop
    return
  }
  const diff = scrollTop - prevScrollTop
  // 下滑
  if (diff > 0) {
    if (scrollTop > 100) {
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
</script>
