import { readonly, ref } from 'vue'
import { defineStore } from 'pinia'
import { useEscapeClose } from '@/compositions/utils/escape-close'

/**
 * 已订阅提醒弹窗 Store
 */
export const useAlreadySubscribedDialogStore = defineStore('already-subscribed-dialog-store', () => {
  const { push, remove } = useEscapeClose()
  const isOpen = ref(false)
  const creatorName = ref('')

  const dialogKey = '__ALREADY_SUBSCRIBED_DIALOG'
  const bindOnOpen = () => push({ key: dialogKey, target: isOpen, fn: close })
  const bindOnClose = () => remove(dialogKey)

  function open(creator) {
    creatorName.value = creator || ''
    isOpen.value = true
    bindOnOpen()
  }

  function close() {
    isOpen.value = false
    creatorName.value = ''
    bindOnClose()
  }

  return {
    open,
    close,
    isOpen: readonly(isOpen),
    creatorName: readonly(creatorName),
  }
})
