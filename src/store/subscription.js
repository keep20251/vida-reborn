import { readonly, ref } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { useDialogStore } from './dialog'

/**
 * 創作者訂閱方案彈窗 Store
 */
export const useSubsciptionStore = defineStore('subscription-store', () => {
  const { subscriptionDialog } = storeToRefs(useDialogStore())

  const _items = ref([])

  function open(items) {
    console.log('useSubsciptionStore.open', items)
    _items.value = items
    subscriptionDialog.value = true
  }

  function close() {
    _items.value = []
    subscriptionDialog.value = false
  }

  return {
    open,
    close,
    items: readonly(_items),
  }
})
