import { watch, onActivated, onDeactivated } from 'vue'
import { storeToRefs } from 'pinia'
import { usePopupDialogStore } from '@/store/popup-dialog'

/**
 *
 * @param {function} validator 驗證函示，驗證通過回傳資料，未通過回傳 false
 */
export function useConfirmData(validator) {
  let activated = false
  const { confirmData } = storeToRefs(usePopupDialogStore())

  watch(confirmData, (newConfirmData) => {
    if (activated && newConfirmData) {
      let data
      try {
        data = validator()
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
