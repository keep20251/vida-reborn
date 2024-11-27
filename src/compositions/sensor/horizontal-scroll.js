import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useResizeObserver, useScroll } from '@vueuse/core'

/**
 * 用於水平滾動的 Composition API
 * 提供滾動、箭頭顯示、歸位、移動到指定項目、向左移動、向右移動等功能
 * @param { Ref<HTMLElement> } outerElement 滾動區域外層 container
 * @param { Ref<HTMLElement> } scrollElement 滾動區域內層 scroll container
 * @param items 滾動區域內部的 items
 * @param options
 * @param { String<'smooth' | 'auto'> } options.scrollBehavior 滾動行為
 * @param { Number } options.transitionMovement 每次點擊箭頭UI的移動距離
 * @returns
 * @see {@link @/components/common/TagSwiper.vue}
 */
export function useHorizontalScroll(
  outerElement,
  scrollElement,
  items,
  { scrollBehavior = 'smooth', transitionMovement = 250 } = {},
) {
  let scroll = null
  let resizeObserver = null

  onMounted(() => {
    scroll = useScroll(scrollElement, { behavior: scrollBehavior })
    resizeObserver = useResizeObserver(scrollElement, updateWidth)
  })
  onBeforeUnmount(() => resizeObserver?.stop())

  const width = ref({ outerWidth: 0, scrollWidth: 0 })
  function updateWidth() {
    width.value.outerWidth = outerElement.value.clientWidth
    width.value.scrollWidth = scrollElement.value.scrollWidth
    console.log('updateWidth', width.value)
  }

  const showArrow = computed(() => width.value.scrollWidth > width.value.outerWidth)
  const showLeft = computed(() => !scroll?.arrivedState.left && showArrow.value)
  const showRight = computed(() => !scroll?.arrivedState.right && showArrow.value)

  function _normalize({ left, right }) {
    scroll.arrivedState.left = left
    scroll.arrivedState.right = right
  }
  const normalizeToLeft = () => _normalize({ left: true, right: false })
  const normalizeToRight = () => _normalize({ left: false, right: true })

  function moveToItem(index) {
    let shiftX = 0
    for (let i = 0; i < items.value.length; i++) {
      if (i >= index) break
      shiftX += items.value[i].$el.scrollWidth
    }
    scrollElement.value.scrollLeft = shiftX
  }

  const _moveTo = (vectorX) => (scroll.x.value += vectorX)
  const moveToLeft = () => _moveTo(-transitionMovement)
  const moveToRight = () => _moveTo(transitionMovement)

  return {
    showArrow,
    showLeft,
    showRight,
    normalizeToLeft,
    normalizeToRight,
    moveToItem,
    moveToLeft,
    moveToRight,
    forceUpdateWidth: updateWidth,
  }
}
