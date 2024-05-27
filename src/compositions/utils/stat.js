import { useIntersectionObserver } from '@vueuse/core'
import useRequest from '@use/request/index.js'

export function useStat(targetEleRef, { id, activeFn, activeMs = () => 0 }) {
  let intersectEver = false

  useIntersectionObserver(
    targetEleRef,
    ([{ isIntersecting }]) => {
      if (isIntersecting) {
        intersectEver = true
        activeFn && activeFn()
      } else {
        if (intersectEver) {
          const time = activeMs()
          useRequest('Home.stat', { params: { id, time }, immediate: true }).catch((e) =>
            console.warn('流量統計api異常', e),
          )
        }
      }
    },
    { threshold: 0.5 },
  )
}
