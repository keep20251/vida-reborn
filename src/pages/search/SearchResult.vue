<template>
  <div>
    <div v-show="activeTab === SEARCH_TAB.AUTHOR" class="overflow-x-hidden">
      <List :items="creatorFetcher.dataList" item-key="id" divider>
        <template #default="{ item }">
          <SearchCreatorCard :item="item" class="mt-20"></SearchCreatorCard>
        </template>
        <template #bottom>
          <div class="flex items-center justify-center py-8 text-gray-a3">
            <Loading v-if="creatorFetcher.isLoading"></Loading>
            <span v-if="creatorFetcher.noMore"> {{ $t('common.noMore') }}</span>
          </div>
        </template>
      </List>
    </div>
    <div v-show="activeTab === SEARCH_TAB.POST" class="overflow-x-hidden">
      <List :items="articleFetcher.dataList" item-key="id" divider>
        <template #default="{ item }">
          <Feed class="py-20" :item="item"></Feed>
        </template>
        <template #bottom>
          <div class="flex items-center justify-center py-8 text-gray-a3">
            <Loading v-if="articleFetcher.isLoading"></Loading>
            <span v-if="articleFetcher.noMore">{{ $t('common.noMore') }}</span>
          </div>
        </template>
      </List>
    </div>
  </div>
</template>
<script setup>
import { onDeactivated, watch } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useHydrationStore } from '@/store/hydration'
import { useSearchStore } from '@/store/search'
import SearchCreatorCard from '@comp/card/SearchCreatorCard.vue'
import Feed from '@comp/main/Feed.vue'
import { onHydration, onServerClientOnce } from '@use/lifecycle'
import { SEARCH_TAB } from '@const'

const searchStore = useSearchStore()
const { setKeyword } = searchStore
const { keyword, activeTab, reloadAction, articleFetcher, creatorFetcher } = storeToRefs(searchStore)

const route = useRoute()

watch(
  () => route.query.q,
  (newQ) => {
    if (!newQ) return
    setKeyword(newQ)
    console.log('watch.newQ', keyword.value)
    reloadAction.value({ newParams: { keyword: keyword.value } })
  },
  { immediate: true },
)

watch(activeTab, () => reloadAction.value({ newParams: { keyword: keyword.value } }))

const { relatedAuthors, relatedFeeds, keyword: hydrationKeyword } = storeToRefs(useHydrationStore())

onServerClientOnce(async (isSSR) => {
  setKeyword(route.query.q)
  if (!keyword.value) return
  await creatorFetcher.value.reload({ newParams: { keyword: keyword.value } })
  await articleFetcher.value.reload({ newParams: { keyword: keyword.value } })
  if (isSSR) {
    hydrationKeyword.value = keyword.value
    relatedAuthors.value = creatorFetcher.value.dataList
    relatedFeeds.value = articleFetcher.value.dataList
  }
})
onHydration(() => {
  setKeyword(hydrationKeyword.value)
  if (!keyword.value) return
  creatorFetcher.value.revert({ dataList: relatedAuthors.value }, { newParams: { keyword: keyword.value } })
  articleFetcher.value.revert({ dataList: relatedFeeds.value }, { newParams: { keyword: keyword.value } })
})
</script>
