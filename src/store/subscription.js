import { computed, readonly, ref } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { useHistory } from '@/compositions/routers/history'
import { SUBSCRIPTION_ROUTE, SUBSCRIPTION_TYPE } from '@/constant'
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

  function openFromFeed({ feed, creator }) {
    _feed.value = feed
    _creator.value = creator
    subscriptionDialog.value = true
  }

  function _reset() {
    subscriptionDialog.value = false
    _items.value = []
    _feed.value = null
    _creator.value = null
    _subscriptions.value = []
    activeSubscription.value = null
    currentTab.value = SUBSCRIPTION_TYPE.RECOMMEND
    init(SUBSCRIPTION_ROUTE.LIST)
  }

  const { now, goto, back, init } = useHistory({ initValue: SUBSCRIPTION_ROUTE.LIST })
  const isList = computed(() => now.value === SUBSCRIPTION_ROUTE.LIST)
  const isDetail = computed(() => now.value === SUBSCRIPTION_ROUTE.DETAIL)

  /**
   * 以下這邊都是訂閱詳情的狀態
   */
  const activeSubscription = ref(null)
  const _subscriptions = ref([])

  const setDetail = ({ activeSubscription: activeOption, subscriptions }) => {
    activeSubscription.value = activeOption
    _subscriptions.value = subscriptions
    goto(SUBSCRIPTION_ROUTE.DETAIL)
  }

  return {
    open,
    close: _reset,
    openFromFeed: afterLoginAction(openFromFeed),
    closeFromFeed: _reset,
    isOpen: readonly(subscriptionDialog),
    items: readonly(_items),
    creator: readonly(_creator),
    feed: readonly(_feed),
    currentTab,
    isFeedSubscription,

    now,
    isList,
    isDetail,
    goto,
    back,

    subscriptions: readonly(_subscriptions),
    activeSubscription,
    setDetail,
  }
})
