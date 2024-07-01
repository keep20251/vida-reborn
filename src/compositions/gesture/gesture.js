import { readonly, ref } from 'vue'
import { useEventListener, useSwipe, useWindowSize } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/store/app'
import { useDbClick } from '@use/gesture/db-click'
import { useMouseSwipe } from '@use/gesture/mouse-swipe'

function isIOS() {
  return (
    ['iPad Simulator', 'iPhone Simulator', 'iPod Simulator', 'iPad', 'iPhone', 'iPod'].includes(navigator.platform) ||
    // iPad on iOS 13 detection
    (navigator.userAgent.includes('Mac') && 'ontouchend' in document)
  )
}

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
  const { width: VP_WIDTH, height: VP_HEIGHT } = useWindowSize()

  const scale = ref(scaleMin)
  const scaling = ref(false)
  const scaleCenterX = ref(null)
  const scaleCenterY = ref(null)
  const tapTransitioning = ref(false)

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
  function changeScale(delta) {
    if (!scaleCenterX.value && !scaleCenterY.value) {
      setScaleCenter(targetRef.value.offsetWidth / 2, targetRef.value.offsetHeight / 2)
    }
    setScale(scale.value + delta)
    if (scale.value === scaleMin) {
      setSclaeCenterTimeoutId = setTimeout(() => {
        setScaleCenter()
      }, 500)
    }
  }

  const appStore = useAppStore()
  const { isDesktop } = storeToRefs(appStore)

  // wheel for desktop
  useEventListener(targetRef, 'wheel', (evt) => {
    const delta = evt.deltaY < 0 ? 0.2 : -0.2
    changeScale(delta)
  })

  // pinch gesture
  const pinchManipulation = {
    ios: {
      start: {
        eventName: 'gesturestart',
        handler: (evt) => {
          if (scaling.value) return
          scaling.value = true
          scaleBeforePinch = scale.value
          setScaleCenter(evt.clientX, evt.clientY)
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
            const [{ clientX: x0, clientY: y0 }, { clientX: x1, clientY: y1 }] = evt.touches
            const diffX = x0 - x1
            const diffY = y0 - y1
            const minX = Math.min(x0, x1)
            const minY = Math.min(y0, y1)
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
          const [{ clientX: x0, clientY: y0 }, { clientX: x1, clientY: y1 }] = evt.touches
          const diffX = x0 - x1
          const diffY = y0 - y1
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
    if (scale.value === scaleMin) {
      tapTransitioning.value = true
      setScale(scaleMax)
      setScaleCenter(evt.clientX, evt.clientY)
    } else {
      setScale(scaleMin)
      setSclaeCenterTimeoutId = setTimeout(() => {
        setScaleCenter()
        tapTransitioning.value = false
      }, 500)
    }
    onTap && onTap(evt)
  })

  // pan gesture
  let panStart
  const { lengthX, lengthY } = (isDesktop.value ? useMouseSwipe : useSwipe)(targetRef, {
    threshold: 0,
    onSwipe(evt) {
      if (scaling.value || scale.value === scaleMin) return
      if (!panStart) {
        panStart = { X: scaleCenterX.value, Y: scaleCenterY.value }
        onPanStart && onPanStart(evt)
      }

      const [prevX, prevY] = [scaleCenterX.value, scaleCenterY.value]
      scaleCenterX.value = Math.min(VP_WIDTH.value, Math.max(0, panStart.X + lengthX.value / (scale.value - scaleMin)))
      scaleCenterY.value = Math.min(VP_HEIGHT.value, Math.max(0, panStart.Y + lengthY.value / (scale.value - scaleMin)))
      if (prevX === scaleCenterX.value && prevY === scaleCenterY.value) return

      evt.stopPropagation()
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
    tapTransitioning: readonly(tapTransitioning),
    scaleUp: () => changeScale(0.2),
    scaleDown: () => changeScale(-0.2),
    reset,
  }
}
