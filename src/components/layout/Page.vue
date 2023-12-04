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
        <div v-if="$slots['aside-top']" class="fixed top-0 h-52 bg-white md:w-[300px] xl:w-[350px]">
          <slot name="aside-top"></slot>
        </div>
        <div :class="{ 'pt-52': $slots['aside-top'] }">
          <slot name="aside"></slot>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useInfiniteScroll } from '@vueuse/core'

const props = defineProps({
  infinite: { type: Boolean, default: false },
  infiniteDistance: { type: Number, default: 100 },
})

const emits = defineEmits(['load'])

const page = ref(null)

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
let prevScrollTop
function onScroll({ target: { scrollTop } }) {
  if (!prevScrollTop) {
    prevScrollTop = scrollTop
    return
  }
  const diff = scrollTop - prevScrollTop
  if (diff > 0 && scrollTop > 100) {
    mainTopOpen.value = false
  }
  if (diff < 0 && !mainTopOpen.value) {
    mainTopOpen.value = true
  }
  prevScrollTop = scrollTop
}
</script>
