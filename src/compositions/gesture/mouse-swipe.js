import { computed, reactive, readonly, ref } from 'vue'
import { useEventListener } from '@vueuse/core'

export function useMouseSwipe(target, options = {}) {
  const { threshold = 50, onSwipeStart, onSwipe, onSwipeEnd, onSwipeCancel } = options

  const posStart = reactive({ x: 0, y: 0 })
  const updatePosStart = (x, y) => {
    posStart.x = x
    posStart.y = y
  }

  const posEnd = reactive({ x: 0, y: 0 })
  const updatePosEnd = (x, y) => {
    posEnd.x = x
    posEnd.y = y
  }

  const distanceX = computed(() => posStart.x - posEnd.x)
  const distanceY = computed(() => posStart.y - posEnd.y)

  const { max, abs } = Math
  const isThresholdExceeded = computed(() => max(abs(distanceX.value), abs(distanceY.value)) >= threshold)
  const isSwiping = ref(false)
  const isMouseDown = ref(false)

  const direction = computed(() => {
    if (!isThresholdExceeded.value) return 'none'

    if (abs(distanceX.value) > abs(distanceY.value)) {
      return distanceX.value > 0 ? 'left' : 'right'
    } else {
      return distanceY.value > 0 ? 'up' : 'down'
    }
  })

  const eventIsAllowed = (e) => {
    return e.which === 1 // 滑鼠左鍵
  }

  const stops = [
    useEventListener(target, 'mousedown', (e) => {
      if (!eventIsAllowed(e)) return
      e.preventDefault()
      isMouseDown.value = true

      const { clientX: x, clientY: y } = e
      updatePosStart(x, y)
      updatePosEnd(x, y)
      onSwipeStart?.(e)
    }),

    useEventListener(target, 'mousemove', (e) => {
      if (!eventIsAllowed(e)) return
      if (!isMouseDown.value) return
      e.preventDefault()

      const { clientX: x, clientY: y } = e
      updatePosEnd(x, y)
      if (!isSwiping.value && isThresholdExceeded.value) isSwiping.value = true
      if (isSwiping.value) onSwipe?.(e)
    }),

    useEventListener(target, 'mouseup', (e) => {
      if (!eventIsAllowed(e)) return
      e.preventDefault()
      if (isSwiping.value) onSwipeEnd?.(e, direction.value)

      isMouseDown.value = false
      isSwiping.value = false
    }),

    useEventListener(target, 'mouseleave', (e) => {
      if (!eventIsAllowed(e)) return
      e.preventDefault()
      if (isSwiping.value) onSwipeCancel?.(e, direction.value)

      isMouseDown.value = false
      isSwiping.value = false
    }),
  ]

  const stop = () => stops.forEach((s) => s())

  return {
    isSwiping: readonly(isSwiping),
    direction: readonly(direction),
    coordsStart: readonly(posStart),
    coordsEnd: readonly(posEnd),
    lengthX: distanceX,
    lengthY: distanceY,
    stop,
  }
}
