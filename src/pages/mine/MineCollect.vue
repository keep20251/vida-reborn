<template>
  <div class="pt-20 text-base font-bold leading-lg">{{ $t('content.allPosts') }} {{ total }}</div>
  <List :items="items" item-key="id" divider>
    <template #default="{ item }">
      <Feed class="py-20" :item="item"></Feed>
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
import { useInfinite } from '@use/request/infinite'
import { GET_ARTICLE_COLLECT, GET_ARTICLE_LIST, MINE_COLLECT_TAB } from '@const'

const tab = ref(MINE_COLLECT_TAB.ALL)
const tabOptions = [
  { label: 'label.all', value: MINE_COLLECT_TAB.ALL },
  { label: 'label.unlocked', value: MINE_COLLECT_TAB.UNLOCKED },
  { label: 'label.notUnlocked', value: MINE_COLLECT_TAB.NOT_UNLOCKED },
]

const feedStore = useFeedStore()

const pages = {
  [MINE_COLLECT_TAB.ALL]: {
    inited: false,
    infinite: useInfinite('User.listArticle', {
      params: { type: GET_ARTICLE_LIST.LIKE },
      transformer: feedStore.sync,
    }),
  },
  [MINE_COLLECT_TAB.UNLOCKED]: {
    inited: false,
    infinite: useInfinite('User.listArticle', {
      params: { type: GET_ARTICLE_LIST.LIKE, unlock: GET_ARTICLE_COLLECT.UNLOCKED },
      transformer: feedStore.sync,
    }),
  },
  [MINE_COLLECT_TAB.NOT_UNLOCKED]: {
    inited: false,
    infinite: useInfinite('User.listArticle', {
      params: { type: GET_ARTICLE_LIST.LIKE, unlock: GET_ARTICLE_COLLECT.NOT_UNLOCKED },
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
