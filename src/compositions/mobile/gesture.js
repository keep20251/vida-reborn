import { ref, readonly } from 'vue'
import { storeToRefs } from 'pinia'
import { useSwipe, useEventListener } from '@vueuse/core'
import { useAppStore } from '@/store/app'
import { useDbClick } from '@use/mobile/dbClick'
import { isIOS } from '@/utils/device'

export function useGesture(
  targetRef,
  {
    scaleMin = 1,
    scaleMax = 4,
    onPinchStart,
    onPinchChange,
    onPinchEnd,
    onPanStart,
    onPanChange,
    onPanEnd,
    onTap,
  } = {},
) {
  const VIEWPORT_WIDTH = window.innerWidth
  const VIEWPORT_HEIGHT = window.innerHeight

  const scale = ref(scaleMin)
  const scaling = ref(false)
  const scaleCenterX = ref(null)
  const scaleCenterY = ref(null)

  function reset() {
    scale.value = scaleMin
    scaling.value = false
    scaleCenterX.value = null
    scaleCenterY.value = null
  }

  let scaleBeforePinch
  let setSclaeCenterTimeoutId
  function setScale(v) {
    scale.value = Math.min(scaleMax, Math.max(scaleMin, v))
  }
  function setScaleCenter(x, y) {
    clearTimeout(setSclaeCenterTimeoutId)
    if (typeof x === 'number' && typeof y === 'number') {
      if (scaleCenterX.value === null && scaleCenterY.value === null) {
        scaleCenterX.value = x
        scaleCenterY.value = y
      }
    } else {
      if (scale.value === scaleMin) {
        scaleCenterX.value = null
        scaleCenterY.value = null
      }
    }
  }

  const appStore = useAppStore()
  const { isDesktop } = storeToRefs(appStore)

  // pinch gesture
  const pinchManipulation = {
    ios: {
      start: {
        eventName: 'gesturestart',
        handler: (evt) => {
          if (scaling.value) return
          scaling.value = true
          scaleBeforePinch = scale.value
          setScaleCenter(evt.pageX, evt.pageY)
          onPinchStart && onPinchStart(evt)
        },
      },
      change: {
        eventName: 'gesturechange',
        handler: (evt) => {
          if (!scaling.value) return
          setScale(scaleBeforePinch * evt.scale)
          onPinchChange && onPinchChange(evt)
        },
      },
      end: {
        eventName: 'gestureend',
        handler: (evt) => {
          if (!scaling.value) return
          setTimeout(() => (scaling.value = false), 50)
          scaleBeforePinch = undefined
          setScaleCenter()
          onPinchEnd && onPinchEnd(evt)
        },
      },
    },
    default: {
      start: {
        eventName: 'touchstart',
        handler: (evt) => {
          if (scaling.value) return
          if (evt.touches.length === 2) {
            scaling.value = true
            scaleBeforePinch = scale.value
            const diffX = evt.touches[0].pageX - evt.touches[1].pageX
            const diffY = evt.touches[0].pageY - evt.touches[1].pageY
            const minX = Math.min(evt.touches[0].pageX, evt.touches[1].pageX)
            const minY = Math.min(evt.touches[0].pageY, evt.touches[1].pageY)
            pinchManipulation.default.start._dist = Math.hypot(diffX, diffY)
            setScaleCenter(minX + Math.abs(diffX), minY + Math.abs(diffY))
            onPinchStart && onPinchStart(evt)
          }
        },
      },
      change: {
        eventName: 'touchmove',
        handler: (evt) => {
          if (!scaling.value) return
          const diffX = evt.touches[0].pageX - evt.touches[1].pageX
          const diffY = evt.touches[0].pageY - evt.touches[1].pageY
          setScale(scaleBeforePinch * (Math.hypot(diffX, diffY) / pinchManipulation.default.start._dist))
          onPinchChange && onPinchChange(evt)
        },
      },
      end: {
        eventName: 'touchend',
        handler: (evt) => {
          if (!scaling.value) return
          evt.stopPropagation()
          scaling.value = false
          scaleBeforePinch = undefined
          delete pinchManipulation.default.start._dist
          setScaleCenter()
          onPinchEnd && onPinchEnd(evt)
        },
      },
    },
  }
  const { start, change, end } = isIOS() ? pinchManipulation.ios : pinchManipulation.default
  useEventListener(targetRef, start.eventName, start.handler)
  useEventListener(targetRef, change.eventName, change.handler)
  useEventListener(targetRef, end.eventName, end.handler)

  // tap gesture
  useDbClick(targetRef, (evt) => {
    if (isDesktop.value) {
      return
    }
    if (scale.value === scaleMin) {
      setScale(scaleMax)
      setScaleCenter(evt.pageX, evt.pageY)
    } else {
      setScale(scaleMin)
      setSclaeCenterTimeoutId = setTimeout(setScaleCenter, 500)
    }
    onTap && onTap(evt)
  })

  // pan gesture
  let panStart
  const { lengthX, lengthY } = useSwipe(targetRef, {
    threshold: 0,
    onSwipe(evt) {
      if (scaling.value || scale.value === scaleMin) return
      if (!panStart) {
        panStart = { X: scaleCenterX.value, Y: scaleCenterY.value }
        onPanStart && onPanStart(evt)
      }
      scaleCenterX.value = Math.min(VIEWPORT_WIDTH, Math.max(0, panStart.X + lengthX.value / (scale.value - scaleMin)))
      scaleCenterY.value = Math.min(VIEWPORT_HEIGHT, Math.max(0, panStart.Y + lengthY.value / (scale.value - scaleMin)))
      onPanChange && onPanChange(evt)
    },
    onSwipeEnd(evt) {
      if (scaling.value || scale.value === scaleMin) return
      panStart = undefined
      onPanEnd && onPanEnd(evt)
    },
  })

  return {
    scale: readonly(scale),
    scaling: readonly(scaling),
    scaleCenterX: readonly(scaleCenterX),
    scaleCenterY: readonly(scaleCenterY),
    reset,
  }
}
