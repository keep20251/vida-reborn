import { watch, onUnmounted, onDeactivated, onActivated } from 'vue'
import { MEDIA_TYPE } from '@/constant'
import API from '@/http'

export function useStat(mediaType, activeSource, statInfoSource, { activeFn, activeMs }) {
  function stat() {
    const { id, available } = statInfoSource()

    // 帖子未開放(未訂閱/未購買/被封鎖)
    if (!available) return

    const time = activeMs()
    const data = { id }
    if (MEDIA_TYPE.VIDEO === mediaType) {
      data.time = time
    }
    API.Media.stat({ data })
      .then(() => console.log(`達到門檻(${time})做統計`, id))
      .catch((e) => console.warn('流量統計api異常', e))
  }

  watch(
    activeSource,
    (n, o) => {
      if (o === undefined) return
      if (n) {
        activeFn && activeFn()
      } else {
        stat()
      }
    },
    { immediate: true },
  )
  const checkActiveFn = (fn) => () => activeSource() && fn && fn()
  onUnmounted(checkActiveFn(stat))
  onDeactivated(checkActiveFn(stat))
  onActivated(checkActiveFn(activeFn))
}
