import { readonly, ref } from 'vue'
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
  { isVerticle = false, velocityThreshold = 200, initIndex = 0, easingFn = defaultEasingFn, window = undefined } = {},
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

  let startIndex
  let destIndex
  let duration
  let start
  let stop = false
  const { resume, pause, isActive } = useRafFn(
    ({ timestamp }) => {
      if (stop) {
        pause()
        index.value = round(index.value)
        return
      }
      if (timestamp - start >= duration) {
        stop = true
      }
      const p = (timestamp - start) / duration
      const v = easingFn(p)
      index.value = toFixedNumber(startIndex + (destIndex - startIndex) * v, 2)
    },
    { immediate: false },
  )
  function anim(delta) {
    startIndex = index.value
    const destCalc = delta > 0 ? ceil : delta < 0 ? floor : round
    destIndex = destCalc(startIndex)
    if (delta !== 0 && destIndex === startIndex) {
      destIndex += delta > 0 ? 1 : -1
    }
    duration = abs(startIndex - destIndex) * 250
    if (duration === 0) return
    start = performance.now()
    stop = false
    resume()
  }
  function animForward() {
    if (isActive.value || disabled.value || index.value === itemsRef.value.length - 1) {
      return
    }
    anim(1)
  }
  function animBackward() {
    if (isActive.value || disabled.value || index.value === 0) {
      return
    }
    anim(-1)
  }
  function animRevert() {
    anim(0)
  }

  const { lengthX, lengthY, direction, coordsStart } = useSwipeFromVueuse(eleRef, {
    threshold: 0,
    onSwipe(e) {
      if (isActive.value || disabled.value) {
        return
      }

      if (window !== undefined) {
        const HALF_VIEW_WIDTH = window.innerWidth / 2
        const EDGE_DIST = 20

        if (coordsStart.x <= EDGE_DIST || coordsStart.x >= HALF_VIEW_WIDTH * 2 - EDGE_DIST) {
          return
        }
      }

      if (!swipeStartDir && direction.value !== 'none') {
        swipeStartDir = direction.value
      }

      if (!dirs.includes(swipeStartDir)) {
        return
      }

      const length = isVerticle ? lengthY.value : lengthX.value

      if (length < 0 && index.value === 0) {
        return
      }

      if (length > 0 && index.value === itemsRef.value.length - 1) {
        return
      }

      e.stopPropagation()

      if (!swipeStart) {
        swipeStart = true
        origIndex = index.value
      }

      updatePosition(length)

      const deltaRate = max(-1, min(1, length / (isVerticle ? height.value : width.value)))
      index.value = toFixedNumber(origIndex + deltaRate, 2)
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
      const velocity = abs(getVelocity())
      resetVelocity()

      if (velocity > velocityThreshold) {
        if ((dir === 'down' || dir === 'right') && length < 0 && delta < 0) {
          animBackward()
        } else if ((dir === 'up' || dir === 'left') && length > 0 && delta > 0) {
          animForward()
        } else {
          animRevert()
        }
      } else {
        animRevert()
      }
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
    index.value = defaultIndex
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
