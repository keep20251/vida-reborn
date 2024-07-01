import { ref, watch } from 'vue'
import { useElementBounding, useEventListener } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/store/app'

export function useDrag(targetEleRef, { onUpdate, onEnd, isVertical = false }) {
  const appStore = useAppStore()
  const { isDesktop } = storeToRefs(appStore)

  const isDragging = ref(false)

  const { max, min } = Math

  const {
    left: targetLeft,
    // right: targetRight,
    // top: targetTop,
    bottom: targetBottom,
    width: targetWidth,
    height: targetHeight,
    // update: updateTargetBounding,
  } = useElementBounding(targetEleRef)

  function onStart(evt) {
    isDragging.value = true
    evt.stopPropagation()
    update(evt)
  }
  function onMove(evt) {
    if (!isDragging.value) return
    evt.stopPropagation()
    evt.preventDefault()
    update(evt)
  }
  function onStop(evt) {
    if (!isDragging.value) return
    isDragging.value = false
    evt.stopPropagation()
    onEnd && onEnd()
  }
  function update(evt) {
    if (isVertical) {
      const clientY = evt.clientY || evt.touches[0].clientY
      const y = min(targetHeight.value, max(0, targetBottom.value - clientY))
      const rate = y / targetHeight.value
      onUpdate && onUpdate(max(0, min(1, rate)))
    } else {
      const clientX = evt.clientX || evt.touches[0].clientX
      const x = min(targetWidth.value, max(0, clientX - targetLeft.value))
      const rate = x / targetWidth.value
      onUpdate && onUpdate(max(0, min(1, rate)))
    }
  }

  const stops = []
  function bindEventHandler() {
    stops.forEach((s) => s())
    stops.length = 0
    if (isDesktop.value) {
      stops.push(useEventListener(targetEleRef, 'mousedown', onStart))
      stops.push(useEventListener('mousemove', onMove))
      stops.push(useEventListener('mouseup', onStop))
    } else {
      stops.push(useEventListener(targetEleRef, 'touchstart', onStart))
      stops.push(useEventListener(targetEleRef, 'touchmove', onMove))
      stops.push(useEventListener(targetEleRef, 'touchend', onStop))
    }
  }
  watch(isDesktop, bindEventHandler, { immediate: true })

  return { isDragging }
}
