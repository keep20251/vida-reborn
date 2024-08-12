import { ref, watch } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'

/** 再次封裝 @vueuse 的 useIntersectionObserver，並在進入 || 離開時觸發hook */
export function useIntersection(target, { onEnter = () => {}, onLeave = () => {} } = {}) {
  const isIntersecting = ref(false)

  useIntersectionObserver(target, (event) =>
    isIntersecting.value ^ event[0].isIntersecting ? (isIntersecting.value = event[0].isIntersecting) : void 0,
  )
  watch(isIntersecting, (v) => (v ? onEnter() : onLeave()))

  return { isIntersecting }
}
