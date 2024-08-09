import { computed } from 'vue'
import { useScroll } from '@vueuse/core'

/**
 * 用於水平滾動的 Composition API
 * 提供滾動、箭頭顯示、歸位、移動到指定項目、向左移動、向右移動等功能
 * @param outerElement 滾動區域外層 container
 * @param scrollElement 滾動區域內層 scroll container
 * @param items 滾動區域內部的 items
 * @param options
 * @param options.scrollBehavior 滾動行為，smooth 或 auto
 * @param options.arrowIconWidth 箭頭UI寬度
 * @param options.transitionMovement 每次點擊箭頭UI的移動距離
 * @returns
 * @see {@link @/components/common/TagSwiper.vue}
 */
export function useHorizontalScroll(
  outerElement,
  scrollElement,
  items,
  { scrollBehavior = 'smooth', arrowIconWidth = 16, transitionMovement = 250 } = {},
) {
  const { x, arrivedState } = useScroll(scrollElement, { behavior: scrollBehavior })

  const showArrow = computed(
    () => scrollElement.value?.scrollWidth > outerElement.value?.clientWidth + arrowIconWidth * 2,
  )
  const showLeft = computed(() => !arrivedState.left && showArrow.value)
  const showRight = computed(() => !arrivedState.right && showArrow.value)

  function _normalize({ left, right }) {
    arrivedState.left = left
    arrivedState.right = right
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

  const _moveTo = (vectorX) => (x.value += vectorX)
  const moveToLeft = () => _moveTo(-transitionMovement)
  const moveToRight = () => _moveTo(transitionMovement)

  return {
    x,
    arrivedState,
    showArrow,
    showLeft,
    showRight,
    normalizeToLeft,
    normalizeToRight,
    moveToItem,
    moveToLeft,
    moveToRight,
  }
}
