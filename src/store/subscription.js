import { computed, readonly, ref } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { useHistory } from '@/compositions/routers/history'
import { useEscapeClose } from '@/compositions/utils/escape-close'
import { SUBSCRIPTION_ROUTE, SUBSCRIPTION_TYPE } from '@/constant'
import { useDialogStore } from './dialog'

/**
 * 創作者訂閱方案彈窗 Store
 */
export const useSubsciptionStore = defineStore('subscription-store', () => {
  const { subscriptionDialog } = storeToRefs(useDialogStore())
  const { push, remove } = useEscapeClose()

  const subscriptionDialogKey = '__SUBSCRIPTION_DIALOG'
  const bindOnOpen = () => push({ key: subscriptionDialogKey, target: subscriptionDialog, fn: _reset })
  const bindOnClose = () => remove(subscriptionDialogKey)

  const _items = ref([])

  const _creator = ref(null)

  const _feed = ref(null)

  const currentTab = ref(SUBSCRIPTION_TYPE.RECOMMEND)

  const isFeedSubscription = computed(() => !!_feed.value)

  /** 訂閱彈窗是否從 #包含N篇帖子直接點擊打開 */
  const _fromDetail = ref(false)

  function open({ items, creator }) {
    console.log('useSubsciptionStore.open', items)
    _items.value = items
    _creator.value = creator
    subscriptionDialog.value = true
    bindOnOpen()
  }

  function openFromFeed({ feed, creator }) {
    _feed.value = feed
    _creator.value = creator
    subscriptionDialog.value = true
    bindOnOpen()
  }

  function _reset() {
    subscriptionDialog.value = false
    _fromDetail.value = false
    _items.value = []
    _feed.value = null
    _creator.value = null
    _subscriptions.value = []
    activeSubscription.value = null
    currentTab.value = SUBSCRIPTION_TYPE.RECOMMEND
    init(SUBSCRIPTION_ROUTE.LIST)
    bindOnClose()
  }

  const { now, goto, back, init } = useHistory({ initValue: SUBSCRIPTION_ROUTE.LIST })
  const isList = computed(() => now.value === SUBSCRIPTION_ROUTE.LIST)
  const isDetail = computed(() => now.value === SUBSCRIPTION_ROUTE.DETAIL)
  const showBack = computed(() => isDetail.value && !_fromDetail.value)

  /**
   * 以下這邊都是訂閱詳情的狀態
   */
  const activeSubscription = ref(null)
  const _subscriptions = ref([])

  /**
   * 打開訂閱詳情
   * @param {Object} detailConfig
   * @param {Object} detailConfig.activeSubscription - 當前訂閱方案
   * @param {Array} detailConfig.subscriptions - 訂閱方案列表
   * @param {Object} detailConfig.creator - 創作者信息，如果是從創作者頁進入，這個參數是必須的
   */
  const openDetail = (detailConfig = { activeSubscription: {}, subscriptions: [], creator: null }) => {
    activeSubscription.value = detailConfig.activeSubscription
    _subscriptions.value = detailConfig.subscriptions

    if (detailConfig.creator) _creator.value = detailConfig.creator
    goto(SUBSCRIPTION_ROUTE.DETAIL)

    // 彈窗沒打開代表是從創作者頁直接點擊進入，需要打開彈窗、並且不需要返回
    if (!subscriptionDialog.value) {
      _fromDetail.value = true
      subscriptionDialog.value = true
      bindOnOpen()
    }
  }

  /**
   * 從創作者頁打開訂閱詳情
   *
   * @param {Object} activeSubscription - 當前訂閱方案
   * @param {Array} subscriptions - 訂閱方案列表
   * @param {Object} creator - 創作者信息
   * @returns
   */
  const openDetailFromCreator = ({ activeSubscription, subscriptions, creator }) =>
    openDetail({ activeSubscription, subscriptions, creator })

  return {
    open,
    close: _reset,
    openFromFeed,
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
    showBack,
    goto,
    back,

    subscriptions: readonly(_subscriptions),
    activeSubscription,
    openDetail,
    openDetailFromCreator,
  }
})
