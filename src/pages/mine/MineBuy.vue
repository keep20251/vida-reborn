<template>
  <div v-if="tab === MINE_BUY_TAB.PURCHASED_ARTICLE" class="pt-20 text-base font-bold leading-lg">
    {{ $t('content.allPosts') }} {{ total }}
  </div>

  <div v-if="tab === MINE_BUY_TAB.SUBSCRIPTION">
    <div class="flex items-center justify-between pb-10 pt-20">
      <div class="text-lg font-bold">{{ $t('info.valid') }}</div>
      <i18n-t keypath="info.totalCount" tag="div" class="text-sm text-primary">
        <template #count>
          {{ count }}
        </template>
      </i18n-t>
    </div>
    <div class="text-sm text-gray-a3">{{ $t('info.validInfo') }}</div>
    <List :items="items" item-key="id" divider>
      <template #default="{ item }">
        <Subscription :item="item" @reload="pages[MINE_BUY_TAB.SUBSCRIPTION].infinite.reload"></Subscription>
      </template>
      <template #bottom>
        <NoData v-if="noData" :reload="reload"></NoData>
        <div v-if="isLoading" class="animate-pulse-none flex flex-col space-y-10 pt-10">
          <div class="h-80 w-full rounded-sm bg-gray-e5"></div>
        </div>
      </template>
    </List>

    <div class="flex items-center justify-between pt-20">
      <div class="font-bold">{{ $t('info.invalid') }}</div>
      <i18n-t keypath="info.totalCount" tag="div" class="text-sm text-primary">
        <template #count>
          {{ totalSubExpired }}
        </template>
      </i18n-t>
    </div>
    <div class="text-sm text-gray-a3">{{ $t('info.invalidInfo') }}</div>
    <List :items="itemsSubExpired" item-key="id" divider>
      <template #default="{ item }">
        <Subscription :item="item" @reload="pages[MINE_BUY_TAB.SUBSCRIPTION_EXPIRED].infinite.reload"></Subscription>
      </template>
      <template #bottom>
        <NoData v-if="noDataSubExpired" :reload="reloadSubExpired"></NoData>
        <div v-if="isLoadingSubExpired" class="animate-pulse-none flex flex-col space-y-10 pt-10">
          <div class="h-80 w-full rounded-sm bg-gray-e5"></div>
        </div>
      </template>
    </List>
  </div>

  <List v-else :items="items" item-key="id" divider>
    <template #default="{ item }">
      <Transaction v-if="tab === MINE_BUY_TAB.TRANSACTION" :item="item"></Transaction>
      <Feed v-else-if="tab === MINE_BUY_TAB.PURCHASED_ARTICLE" class="py-20" :item="item"></Feed>
    </template>
    <template #bottom>
      <NoData v-if="noData" :reload="reload"></NoData>
      <div v-else class="flex items-center justify-center py-8 text-gray-a3">
        <Loading v-if="isLoading" :fit-feed="tab === MINE_BUY_TAB.PURCHASED_ARTICLE">
          {{ $t('common.loading') }}
        </Loading>
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
    infinite: useInfinite('User.listSubs', {
      params: { position: 1 },
    }),
  },
  [MINE_BUY_TAB.SUBSCRIPTION_EXPIRED]: {
    inited: false,
    infinite: useInfinite('User.listSubs', {
      params: { position: 2 },
    }),
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
const count = computed(() => pages[tab.value].infinite.dataExtra.value?.count || 0)
const isLoading = computed(() => pages[tab.value].infinite.isLoading.value)
const noMore = computed(() => pages[tab.value].infinite.noMore.value)
const noData = computed(() => pages[tab.value].infinite.noData.value)
const reload = computed(() => pages[tab.value].infinite.reload)

const itemsSubExpired = computed(() => pages[MINE_BUY_TAB.SUBSCRIPTION_EXPIRED].infinite.dataList.value)
const isLoadingSubExpired = computed(() => pages[MINE_BUY_TAB.SUBSCRIPTION_EXPIRED].infinite.isLoading.value)
const noDataSubExpired = computed(() => pages[MINE_BUY_TAB.SUBSCRIPTION_EXPIRED].infinite.noData.value)
const reloadSubExpired = computed(() => pages[MINE_BUY_TAB.SUBSCRIPTION_EXPIRED].infinite.reload)
const totalSubExpired = computed(() => pages[MINE_BUY_TAB.SUBSCRIPTION_EXPIRED].infinite.dataExtra.value?.count || 0)

const mineStore = useMineStore()
const { setTab, clearTab, setNextFn, clearNextFn, setReloadFn, clearReloadFn } = mineStore
watch(
  tab,
  (tab) => {
    const initPage = (page) => {
      if (!page.inited) {
        page.inited = true
        page.infinite.init()
      }
      setNextFn(page.infinite.next)
      setReloadFn(page.infinite.reload)
    }
    initPage(pages[tab])
    if (tab === MINE_BUY_TAB.SUBSCRIPTION) {
      initPage(pages[MINE_BUY_TAB.SUBSCRIPTION_EXPIRED])
    }
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
