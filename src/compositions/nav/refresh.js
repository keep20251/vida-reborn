import { onActivated, onDeactivated, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useNavStore } from '@/store/nav'

export function useNavRefresh(nav, refresher) {
  const navStore = useNavStore()
  const { refreshNav } = storeToRefs(navStore)

  // Deactivated 的時候設為 true，等之後 activated 的時候再刷新
  let needReset = false
  let isActivated = true

  onActivated(() => {
    isActivated = true
    if (needReset) {
      needReset = false
      refresher()
    }
  })

  onDeactivated(() => (isActivated = false))

  watch(refreshNav, (v) => {
    if (v === nav && typeof refresher === 'function') {
      if (isActivated) {
        refresher()
      } else {
        needReset = true
      }
    }
  })
}
