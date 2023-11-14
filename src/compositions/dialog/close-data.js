import { usePopupDialogStore } from '@/store/popup-dialog'
import { storeToRefs } from 'pinia'

export function useCloseData(callback) {
  const { closeCallback } = storeToRefs(usePopupDialogStore())
  closeCallback.value = callback
}
