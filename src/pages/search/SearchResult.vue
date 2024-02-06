<template>
  <div>
    <div v-show="activeTab === SEARCH_TAB.AUTHOR" class="overflow-x-hidden">
      <List :items="creatorList" item-key="id" divider>
        <template #default="{ item }">
          <SearchCreatorCard :item="item" class="mt-20"></SearchCreatorCard>
        </template>
        <template #bottom>
          <div class="flex items-center justify-center py-8 text-gray-a3">
            <Loading v-if="creatorLoading"></Loading>
            <span v-if="creatorNoMore"> {{ $t('common.noMore') }}</span>
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
            <Loading v-if="articleLoading"></Loading>
            <span v-if="articleNoMore">{{ $t('common.noMore') }}</span>
          </div>
        </template>
      </List>
    </div>
  </div>
</template>
<script setup>
import { watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useHydrationStore } from '@/store/hydration'
import { useSearchStore } from '@/store/search'
import SearchCreatorCard from '@comp/card/SearchCreatorCard.vue'
import Feed from '@comp/main/Feed.vue'
import { onHydration, onServerClientOnce } from '@use/lifecycle'
import { useInfinite } from '@use/request/infinite'
import { SEARCH_TAB } from '@const'

const searchStore = useSearchStore()
const { activeTab, nextAction, reloadAction } = storeToRefs(searchStore)

const {
  dataList: articleList,
  isLoading: articleLoading,
  noMore: articleNoMore,
  init: articleInit,
  next: articleNext,
  reload: articleReload,
} = useInfinite('Article.list', {
  params: {},
})

const {
  dataList: creatorList,
  isLoading: creatorLoading,
  noMore: creatorNoMore,
  init: creatorInit,
  revert: creatorRevert,
  next: creatorNext,
  reload: creatorReload,
} = useInfinite('User.searchCreator', {
  params: {},
})

watch(
  activeTab,
  (v) => {
    if (v === SEARCH_TAB.POST && articleList.value.length === 0) articleInit()
    nextAction.value = v === SEARCH_TAB.AUTHOR ? creatorNext : articleNext
    reloadAction.value = v === SEARCH_TAB.AUTHOR ? creatorReload : articleReload
  },
  { immediate: true },
)

const { relatedAuthors } = storeToRefs(useHydrationStore())
onServerClientOnce(async (isSSR) => {
  await creatorInit()
  if (isSSR) relatedAuthors.value = creatorList.value
})
onHydration(() => {
  creatorRevert(relatedAuthors.value)
  console.log('relatedAuthors.value', relatedAuthors.value)
})
</script>
