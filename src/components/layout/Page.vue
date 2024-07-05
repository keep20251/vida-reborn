<template>
  <!--
    min-w-0 沒設的話底下有文字區塊使用 line-clamp-${count} 做換行省略的可能都會跑版
    參考連結: https://css-tricks.com/flexbox-truncated-text/
  -->
  <div class="flex min-w-0 grow basis-full flex-row justify-start sm:basis-[540px] md:basis-[860px] xl:basis-[880px]">
    <div class="w-full max-w-[540px] px-20 sm:pb-0 md:mr-20 md:w-[540px] xl:mr-40">
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
            'pb-60': isNavShow,
          }"
        >
          <slot name="main-top"></slot>
        </div>

        <!-- app-top -->
        <div
          v-if="$slots['app-top']"
          class="fixed top-0 z-20 -ml-20 h-52 max-w-[540px] overflow-hidden bg-white px-20 py-9"
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
          <Loading
            v-if="pullToReload"
            class="absolute left-1/2 -translate-x-1/2"
            :class="{
              'top-4': isMobile && $slots['main-top'] && !$slots['app-top'],
              'top-12':
                (isDesktop &&
                  (($slots['main-top'] && !$slots['app-top']) || (!$slots['main-top'] && $slots['app-top']))) ||
                (isMobile && !$slots['main-top'] && $slots['app-top']),
              'top-56': isMobile && $slots['app-top'] && $slots['main-top'],
              'top-64': isDesktop && $slots['app-top'] && $slots['main-top'],
            }"
            :rate="reloadRate"
          ></Loading>
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
import { useElementSize, useEventListener, useInfiniteScroll, useRafFn, useSwipe, useWindowSize } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/store/app'
import { useNavStore } from '@/store/nav'
import Loading from '@comp/common/Loading.vue'

const props = defineProps({
  mainTopToggleDisabled: { type: Boolean, default: false },
  scrollNavToggleDisabled: { type: Boolean, default: false },
  infinite: { type: Boolean, default: false },
  infiniteDistance: { type: Number, default: 100 },
  infiniteInterval: { type: Number, default: 1000 },
  pullToReload: { type: Boolean, default: false },
  scrollToTopSignal: {},
})

const emits = defineEmits(['load', 'reload'])

const appStore = useAppStore()
const { isDesktop, isMobile } = storeToRefs(appStore)

const navStore = useNavStore()
const { hide: hideNav, show: showNav } = navStore
const { isShow: isNavShow } = storeToRefs(navStore)

const main = ref(null)
const aside = ref(null)
const { height: windowHeight } = useWindowSize()
const { height: mainHeight } = useElementSize(main, undefined, { box: 'border-box' })
const { height: asideHeight } = useElementSize(aside, undefined, { box: 'border-box' })

// main-top 滾動切換顯示/隱藏
const mainTopOpen = ref(true)

// 側邊欄滑到底黏在最下方不再繼續往上滑
const asidePosition = ref(null)
const asideHeightOverflow = computed(() => asideHeight.value - windowHeight.value)
const asideStyle = computed(() => {
  const isAsideHeightLtMain = asideHeight.value < mainHeight.value
  const [position, overflow] = [asidePosition.value, asideHeightOverflow.value]
  if (isAsideHeightLtMain && position) {
    return { position, [overflow > 0 ? 'bottom' : 'top']: 0 }
  }
  return {}
})

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
    if (scrollTop > 100) {
      if (!props.mainTopToggleDisabled) {
        mainTopOpen.value = false
      }
      if (!props.scrollNavToggleDisabled && isMobile.value) {
        execOrIgnoreNavHandle(hideNav)
      }
    }
    if (asideHeightOverflow.value > 0 && asidePosition.value === null && scrollTop >= asideHeightOverflow.value) {
      asidePosition.value = 'fixed'
    }
  }
  // 上滑
  else if (diff < 0) {
    if (!mainTopOpen.value) {
      mainTopOpen.value = true
    }
    if (!isNavShow.value) {
      if (!props.scrollNavToggleDisabled && isMobile.value) {
        execOrIgnoreNavHandle(showNav)
      }
    }
    if (asideHeightOverflow.value > 0 && asidePosition.value !== null && scrollTop < asideHeightOverflow.value) {
      asidePosition.value = null
    }
  }
  prevScrollTop = scrollTop
}
function execOrIgnoreNavHandle(navHandler) {
  if (execOrIgnoreNavHandle._ignoreNavHandle) {
    delete execOrIgnoreNavHandle._ignoreNavHandle
  } else {
    navHandler()
  }
}

let active
let stopOnScroll
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

  execOrIgnoreNavHandle._ignoreNavHandle = true
  stopOnScroll = useEventListener('scroll', onScroll)
})
onDeactivated(() => {
  active = false

  stopOnScroll && stopOnScroll()

  showNav()
})

// pull to reload
const reloadRate = ref(0)
let reloadStartY
const { pause, resume: revertReloadRate } = useRafFn(
  () => {
    reloadRate.value -= Math.min(reloadRate.value, 0.03)
    if (reloadRate.value === 0) {
      pause()
    }
  },
  { immediate: false },
)
onMounted(() => {
  useSwipe(document, {
    threshold: 0,
    onSwipe(evt) {
      if (!active || !props.pullToReload) return
      const scrollTop = document.documentElement.scrollTop
      const [{ screenY }] = evt.touches
      if (scrollTop === 0) {
        if (!reloadStartY) {
          reloadStartY = screenY
        }
      }
      if (reloadStartY) {
        reloadRate.value = Math.max(0, Math.min(1, (screenY - reloadStartY) / 100))
      }
    },
    onSwipeEnd() {
      if (!active || !props.pullToReload) return
      if (reloadRate.value >= 1) {
        emits('reload')
        reloadRate.value = 0
      } else {
        revertReloadRate()
      }
      reloadStartY = undefined
    },
  })
})

// 當外部發送的 scrollToTopSignal 改變時，prevScrollTop 改回 0
watch(
  () => props.scrollToTopSignal,
  () => {
    prevScrollTop = 0

    mainTopOpen.value = true
    if (isMobile.value) {
      showNav()
    }
    asidePosition.value = null

    if (active) {
      window.scrollTo(0, prevScrollTop)
    }
  },
)
</script>
