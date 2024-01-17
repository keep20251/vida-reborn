import { watch, onActivated, onDeactivated } from 'vue'
import { storeToRefs } from 'pinia'
import { useModalStore } from '@/store/modal'

/**
 *
 * @param {function} validator 驗證函示，驗證通過回傳資料，未通過回傳 false
 */
export function useConfirmData(validator) {
  let activated = false
  const { confirmData } = storeToRefs(useModalStore())

  watch(confirmData, async (newConfirmData) => {
    if (activated && newConfirmData) {
      let data
      try {
        data = await validator()
      } catch (e) {
        console.warn(e)
        newConfirmData(false)
        return
      }
      newConfirmData(data)
    }
  })

  onActivated(() => (activated = true))
  onDeactivated(() => (activated = false))
}
