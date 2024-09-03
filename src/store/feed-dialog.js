import { computed, readonly, ref } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { useHistoryState } from '@/compositions/routers/history-state'
import { useEscapeClose } from '@/compositions/utils/escape-close'
import { useDialogStore } from './dialog'

export const useFeedDialogStore = defineStore('feed-dialog', () => {
  const { feedDialog } = storeToRefs(useDialogStore())
  const isOpen = computed(() => feedDialog.value)

  const _id = ref(null)
  const _username = ref(null)

  const escapeKey = '__FEED_DIALOG'
  const { push: add, remove } = useEscapeClose()

  const backByPopState = ref(false)
  const { push, revert } = useHistoryState()

  function open({ feedId, username }) {
    _id.value = feedId
    _username.value = username
    feedDialog.value = true
    backByPopState.value = false
    add({ key: escapeKey, target: feedDialog, fn: close })

    push(`/${username}/${feedId}`, {
      onPrev: () => {
        backByPopState.value = true
        close()
      },
    })
  }

  function close() {
    console.log('useFeedDialogStore.close')
    _id.value = null
    _username.value = null
    feedDialog.value = false
    remove(escapeKey)

    // 如果是透過瀏覽器的上一頁按鈕返回，則不需要觸發 revert
    if (!backByPopState.value) revert()
  }

  return {
    isOpen,
    id: readonly(_id),
    username: readonly(_username),
    open,
    close,
  }
})
