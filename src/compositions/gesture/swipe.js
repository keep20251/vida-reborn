import { computed, readonly, ref } from 'vue'
import { useElementSize, useEventListener, usePrevious, useRafFn, useSwipe as useSwipeFromVueuse } from '@vueuse/core'
import velocityCalculator from '@/utils/velocity-calculator'

const { abs, ceil, floor, max, min, pow, round } = Math

function toFixedNumber(n, digits) {
  const p = pow(10, digits)
  return round(n * p) / p
}

// 時間函示(來源: https://github.com/component/ease/blob/master/index.js)
// 外部想換就去找一個傳進 options.easingFn
function defaultEasingFn(n) {
  return --n * n * n * n * n + 1 // outQuint
}

export function useSwipe(
  eleRef,
  itemsRef,
  { isVerticle = false, velocityThreshold = 200, initIndex = 0, edgeDist = 0, easingFn = defaultEasingFn } = {},
) {
  let swipeStart = false
  let swipeStartDir = null
  let origIndex
  const dirs = isVerticle ? ['up', 'down'] : ['left', 'right']

  const { reset: resetVelocity, updatePosition, getVelocity } = velocityCalculator()

  const index = ref(initIndex)
  const disabled = ref(false)
  // const index = computed(() => initIndex)

  const { width, height } = useElementSize(eleRef)
  const lastIndex = computed(() => itemsRef.value.length - 1)
  function reviseIndexRange(v) {
    return max(min(v, lastIndex.value), 0)
  }

  let startIndex
  let destIndex
  let duration
  let start
  let stop = false
  const { resume, pause, isActive } = useRafFn(
    ({ timestamp }) => {
      if (stop) {
        pause()
        index.value = reviseIndexRange(round(index.value))
        return
      }
      if (timestamp - start >= duration) {
        stop = true
      }
      const p = (timestamp - start) / duration
      const v = easingFn(p)
      index.value = reviseIndexRange(toFixedNumber(startIndex + (destIndex - startIndex) * v, 3))
    },
    { immediate: false },
  )
  function anim() {
    duration = abs(startIndex - destIndex) * 250
    if (duration === 0) return
    start = performance.now()
    stop = false
    resume()
  }
  function animForward() {
    if (isActive.value || disabled.value || index.value === lastIndex.value) {
      return
    }
    startIndex = index.value
    destIndex = startIndex >= lastIndex.value ? lastIndex.value : ceil(startIndex)
    if (destIndex === startIndex && destIndex !== lastIndex.value) {
      destIndex += 1
    }
    anim()
  }
  function animBackward() {
    if (isActive.value || disabled.value || index.value === 0) {
      return
    }
    startIndex = index.value
    destIndex = startIndex <= 0 ? 0 : floor(startIndex)
    if (destIndex === startIndex && destIndex !== 0) {
      destIndex -= 1
    }
    anim()
  }
  function animTo(toIndex) {
    startIndex = index.value
    destIndex = reviseIndexRange(round(toIndex))
    anim()
  }

  const { lengthX, lengthY, direction, coordsStart } = useSwipeFromVueuse(eleRef, {
    threshold: 0,
    onSwipe(e) {
      if (isActive.value || disabled.value) {
        return
      }

      if (!swipeStartDir && direction.value !== 'none') {
        swipeStartDir = direction.value
      }

      if (!dirs.includes(swipeStartDir)) {
        return
      }

      if (coordsStart.x <= edgeDist || coordsStart.x >= width.value - edgeDist) {
        return
      }

      const length = isVerticle ? lengthY.value : lengthX.value

      if (length < 0 && (index.value === 0 || origIndex === 0)) {
        return
      }

      if (length > 0 && (index.value === lastIndex.value || origIndex === lastIndex.value)) {
        return
      }

      e.stopPropagation()

      if (!swipeStart) {
        swipeStart = true
        origIndex = index.value
      }

      updatePosition(length)

      const deltaRate = max(-1, min(1, length / (isVerticle ? height.value : width.value)))
      index.value = reviseIndexRange(toFixedNumber(origIndex + deltaRate, 3))
    },
    onSwipeEnd(e) {
      const dir = swipeStartDir
      swipeStartDir = null

      if (!swipeStart) {
        return
      }

      swipeStart = false

      const length = isVerticle ? lengthY.value : lengthX.value
      const delta = length - prevLength.value
      const velocityLtThreshold = abs(getVelocity()) > velocityThreshold
      const absLengthLtHalfViewSize = abs(length) > (isVerticle ? height.value : width.value) / 2
      resetVelocity()

      if (velocityLtThreshold || absLengthLtHalfViewSize) {
        if ((dir === 'down' || dir === 'right') && length < 0 && delta < 0 && origIndex !== 0) {
          animBackward()
        } else if ((dir === 'up' || dir === 'left') && length > 0 && delta > 0 && origIndex !== lastIndex.value) {
          animForward()
        } else {
          animTo(origIndex)
        }
      } else {
        animTo(origIndex)
      }

      origIndex = undefined
    },
  })

  const prevLength = usePrevious(isVerticle ? lengthY : lengthX)

  useEventListener(eleRef, 'touchmove', (e) => {
    if (index.value % 1 !== 0) {
      e.preventDefault()
    }
  })

  function reset(defaultIndex = 0) {
    pause()
    index.value = reviseIndexRange(defaultIndex)
  }

  function enable() {
    disabled.value = false
  }
  function disable() {
    disabled.value = true
  }

  return {
    index: readonly(index),
    disabled: readonly(disabled),
    transitioning: isActive,

    prev: animBackward,
    next: animForward,
    reset,
    enable,
    disable,
  }
}
