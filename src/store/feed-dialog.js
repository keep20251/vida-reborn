import { computed, readonly, ref } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { useEscapeClose } from '@/compositions/utils/escape-close'
import { useDialogStore } from './dialog'

export const useFeedDialogStore = defineStore('feed-dialog', () => {
  const { feedDialog } = storeToRefs(useDialogStore())
  const isOpen = computed(() => feedDialog.value)

  const _id = ref(null)
  const _username = ref(null)

  const modalDialogKey = '__MODAL_DIALOG'
  const { push, remove } = useEscapeClose()

  function open({ feedId, username }) {
    _id.value = feedId
    _username.value = username
    feedDialog.value = true
    push({ key: modalDialogKey, target: feedDialog, fn: close })
  }

  function close() {
    console.log('useFeedDialogStore.close')
    _id.value = null
    _username.value = null
    feedDialog.value = false
    remove(modalDialogKey)
  }

  return {
    isOpen,
    id: readonly(_id),
    username: readonly(_username),
    open,
    close,
  }
})
