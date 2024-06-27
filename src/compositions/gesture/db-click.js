import { useEventListener } from '@vueuse/core'

export function useDbClick(targetRef, handler, { span = 300 } = {}) {
  let prevTime
  let prevX
  let prevY

  useEventListener(targetRef, 'click', (evt) => {
    if (!prevTime) {
      prevTime = new Date().getTime()
      prevX = evt.clientX
      prevY = evt.clientY
      return
    }

    const currTime = new Date().getTime()
    const diffX = Math.abs(prevX - evt.clientX)
    const diffY = Math.abs(prevY - evt.clientY)
    if (currTime - prevTime < span && diffX < 30 && diffY < 30) {
      handler(evt)
      prevTime = undefined
      prevX = undefined
      prevY = undefined
    } else {
      prevTime = currTime
      prevX = evt.clientX
      prevY = evt.clientY
    }
  })
}
