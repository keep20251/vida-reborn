<template>
  <div>
    <div v-show="activeTab === SEARCH_TAB.AUTHOR" class="overflow-x-hidden">
      <List :items="creatorList" item-key="id" divider>
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
      <List :items="articleList" item-key="id" divider>
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
import { watch } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useHydrationStore } from '@/store/hydration'
import { useSearchStore } from '@/store/search'
import SearchCreatorCard from '@comp/card/SearchCreatorCard.vue'
import Feed from '@comp/main/Feed.vue'
import { onHydration, onServerClientOnce } from '@use/lifecycle'
import { SEARCH_TAB } from '@const'

const searchStore = useSearchStore()
const { keyword, activeTab, reloadAction, articleFetcher, creatorFetcher } = storeToRefs(searchStore)

const route = useRoute()
watch(
  () => route.query.q,
  (newQ) => {
    keyword.value = newQ
    reloadAction.value({ newParams: { keyword: keyword.value } })
  },
)
watch(activeTab, () => reloadAction.value({ newParams: { keyword: keyword.value } }))

const { relatedAuthors, keyword: hydrationKeyword } = storeToRefs(useHydrationStore())
onServerClientOnce(async (isSSR) => {
  keyword.value = route.query.q
  if (!keyword.value) return
  await creatorFetcher.value.reload({ newParams: { keyword: keyword.value } })
  if (isSSR) {
    hydrationKeyword.value = keyword.value
    relatedAuthors.value = creatorFetcher.value.dataList
  }
})
onHydration(() => {
  keyword.value = hydrationKeyword.value
  if (!keyword.value) return
  creatorFetcher.value.revert(relatedAuthors.value, { newParams: { keyword: keyword.value } })
})
</script>
