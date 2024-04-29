import { readonly, ref } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { useDialogStore } from './dialog'

/**
 * 創作者訂閱方案彈窗 Store
 */
export const useSubsciptionStore = defineStore('subscription-store', () => {
  const { subscriptionDialog } = storeToRefs(useDialogStore())

  const _items = ref([])

  const _creator = ref(null)

  function open({ items, creator }) {
    console.log('useSubsciptionStore.open', items)
    _items.value = items
    _creator.value = creator
    subscriptionDialog.value = true
  }

  function close() {
    _items.value = []
    _creator.value = null
    subscriptionDialog.value = false
  }

  return {
    open,
    close,
    items: readonly(_items),
    creator: readonly(_creator),
  }
})
