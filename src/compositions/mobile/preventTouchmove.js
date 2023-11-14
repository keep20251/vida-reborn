import { useEventListener } from '@vueuse/core'

export function usePreventTouchmove(eleRef, condition = null) {
  useEventListener(
    eleRef,
    'touchmove',
    (evt) => {
      if (condition === null) {
        evt.preventDefault()
      } else {
        if (typeof condition === 'function' && condition(evt)) {
          evt.preventDefault()
        }
      }
    },
    { passive: false },
  )
}
