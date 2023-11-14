import { useEventListener } from '@vueuse/core'

export function useOnceOrDbClick(targetRef, onceHandler, dbHandler, { span = 200, triggerClassName } = {}) {
  let prevTime
  let onceTimerId

  function reset() {
    clearTimeout(onceTimerId)
    prevTime = undefined
    onceTimerId = undefined
  }

  useEventListener(targetRef, 'click', (evt) => {
    if (!evt.target.classList.contains(triggerClassName)) {
      return
    }

    if (!prevTime) {
      prevTime = new Date().getTime()
      onceTimerId = setTimeout(() => {
        onceHandler(evt)
        reset()
      }, span)
      return
    }

    const currTime = new Date().getTime()
    if (currTime - prevTime < span) {
      dbHandler(evt)
      reset()
    }
  })
}
