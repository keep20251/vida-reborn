import { useEventListener } from '@vueuse/core'

export function useDbClick(targetRef, handler, { span = 300 } = {}) {
  let prevTime

  useEventListener(targetRef, 'click', (evt) => {
    if (!prevTime) {
      prevTime = new Date().getTime()
      return
    }

    const currTime = new Date().getTime()
    if (currTime - prevTime < span) {
      handler(evt)
      prevTime = undefined
    } else {
      prevTime = currTime
    }
  })
}
