import { ref } from 'vue'
import { useElementBounding, useEventListener } from '@vueuse/core'

export function useTimeBarSwipe(timeBarEleRef, update, clear) {
  const isSwiping = ref(false)

  const {
    left: timeBarLeft,
    right: timeBarRight,
    width: timeBarWidth,
    // update: updateTimeBarBounding,
  } = useElementBounding(timeBarEleRef)

  let isStart = false
  function onStart(evt) {
    isStart = true
    onUpdate(evt)
    isSwiping.value = true
  }
  function onMove(evt) {
    if (!isStart) return
    onUpdate(evt)
  }
  function onEnd(evt) {
    isStart = false
    clear()
    isSwiping.value = false
  }
  function onUpdate(evt) {
    const pageX = evt.pageX || evt.touches[0].pageX
    const x = Math.min(timeBarRight.value, Math.max(0, pageX - timeBarLeft.value))
    const rate = x / timeBarWidth.value
    update(Math.max(0, Math.min(1, rate)))
  }

  useEventListener(timeBarEleRef, 'touchmove', (e) => e.preventDefault())

  return { isSwiping, onStart, onMove, onEnd }
}
