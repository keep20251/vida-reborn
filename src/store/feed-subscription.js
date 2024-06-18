import { readonly, ref } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { SUBSCRIPTION_TYPE } from '@/constant'
import { useDialogStore } from './dialog'

export const useFeedSubscriptionStore = defineStore('feed-subscription', () => {
  const { feedSubscriptionDialog } = storeToRefs(useDialogStore())

  const feed = ref(null)
  const creator = ref(null)

  const currentTab = ref(SUBSCRIPTION_TYPE.RECOMMEND)

  const open = ({ feed: _feed, creator: _creator }) => {
    console.log('feed subscription open', { feed: _feed, creator: _creator })
    feed.value = _feed
    creator.value = _creator
    feedSubscriptionDialog.value = true
  }
  const close = () => {
    feedSubscriptionDialog.value = false
    feed.value = null
    creator.value = null
    currentTab.value = SUBSCRIPTION_TYPE.RECOMMEND
  }

  return {
    isOpen: readonly(feedSubscriptionDialog),
    currentTab,
    feed,
    creator,
    open,
    close,
  }
})
