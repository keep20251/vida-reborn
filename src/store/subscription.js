import { computed, readonly, ref } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { SUBSCRIPTION_TYPE } from '@/constant'
import { useAccountStore } from './account'
import { useDialogStore } from './dialog'

/**
 * 創作者訂閱方案彈窗 Store
 */
export const useSubsciptionStore = defineStore('subscription-store', () => {
  const { subscriptionDialog } = storeToRefs(useDialogStore())
  const { afterLoginAction } = useAccountStore()

  const _items = ref([])

  const _creator = ref(null)

  const _feed = ref(null)

  const currentTab = ref(SUBSCRIPTION_TYPE.RECOMMEND)

  const isFeedSubscription = computed(() => !!_feed.value)

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

  function openFromFeed({ feed, creator }) {
    _feed.value = feed
    _creator.value = creator
    subscriptionDialog.value = true
  }
  function closeFromFeed() {
    _feed.value = null
    _creator.value = null
    subscriptionDialog.value = false
    currentTab.value = SUBSCRIPTION_TYPE.RECOMMEND
  }

  return {
    open,
    close,
    openFromFeed: afterLoginAction(openFromFeed),
    closeFromFeed,
    isOpen: readonly(subscriptionDialog),
    items: readonly(_items),
    creator: readonly(_creator),
    feed: readonly(_feed),
    currentTab,
    isFeedSubscription,
  }
})
