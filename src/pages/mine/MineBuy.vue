<template>
  <div v-if="tab === MINE_BUY_TAB.PURCHASED_ARTICLE" class="pt-20 text-base font-bold leading-lg">
    {{ $t('content.allPosts') }} {{ total }}
  </div>
  <List :items="items" item-key="id" divider>
    <template #default="{ item }">
      <Transaction v-if="tab === MINE_BUY_TAB.TRANSACTION" :item="item"></Transaction>
      <Subscription
        v-else-if="tab === MINE_BUY_TAB.SUBSCRIPTION"
        :item="item"
        @reload="pages[MINE_BUY_TAB.SUBSCRIPTION].infinite.reload"
      ></Subscription>
      <Feed v-else-if="tab === MINE_BUY_TAB.PURCHASED_ARTICLE" class="py-20" :item="item"></Feed>
    </template>
    <template #bottom>
      <NoData v-if="!isLoading && items.length === 0 && noMore"></NoData>
      <div v-else class="flex items-center justify-center py-8 text-gray-a3">
        <Loading v-if="isLoading">{{ $t('common.loading') }}</Loading>
        <span v-if="noMore">{{ $t('common.noMore') }}</span>
      </div>
    </template>
  </List>
</template>
<script setup>
import { computed, onActivated, onDeactivated, ref, watch } from 'vue'
import { useFeedStore } from '@/store/feed'
import { useMineStore } from '@/store/mine'
import NoData from '@comp/info/NoData.vue'
import Feed from '@comp/main/Feed.vue'
import Subscription from '@comp/mine/Subscription.vue'
import Transaction from '@comp/mine/Transaction.vue'
import { useInfinite } from '@use/request/infinite'
import { GET_ARTICLE_LIST, MINE_BUY_TAB } from '@const'

const tab = ref(MINE_BUY_TAB.TRANSACTION)
const tabOptions = [
  { label: 'label.texn', value: MINE_BUY_TAB.TRANSACTION },
  { label: 'label.subs', value: MINE_BUY_TAB.SUBSCRIPTION },
  { label: 'label.artPur', value: MINE_BUY_TAB.PURCHASED_ARTICLE },
]

const feedStore = useFeedStore()

const pages = {
  [MINE_BUY_TAB.TRANSACTION]: {
    inited: false,
    infinite: useInfinite('Payment.history'),
  },
  [MINE_BUY_TAB.SUBSCRIPTION]: {
    inited: false,
    infinite: useInfinite('User.listSubs'),
  },
  [MINE_BUY_TAB.PURCHASED_ARTICLE]: {
    inited: false,
    infinite: useInfinite('User.listArticle', {
      params: { type: GET_ARTICLE_LIST.BOUGHT },
      transformer: feedStore.sync,
    }),
  },
}
const items = computed(() => pages[tab.value].infinite.dataList.value)
const total = computed(() => pages[tab.value].infinite.dataExtra.value?.total || 0)
const isLoading = computed(() => pages[tab.value].infinite.isLoading.value)
const noMore = computed(() => pages[tab.value].infinite.noMore.value)

const mineStore = useMineStore()
const { setTab, clearTab, setNextFn, clearNextFn, setReloadFn, clearReloadFn } = mineStore
watch(
  tab,
  (tab) => {
    const page = pages[tab]
    if (!page.inited) {
      page.inited = true
      page.infinite.init()
    }
    setNextFn(page.infinite.next)
    setReloadFn(page.infinite.reload)
  },
  { immediate: true },
)
onActivated(() => {
  setNextFn(pages[tab.value].infinite.next)
  setReloadFn(pages[tab.value].infinite.reload)
  setTab(tab, tabOptions)
})
onDeactivated(() => {
  clearNextFn()
  clearReloadFn()
  clearTab()
})
</script>
