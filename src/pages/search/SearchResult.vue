<template>
  <div>
    <div v-show="activeTab === SEARCH_TAB.AUTHOR" class="overflow-x-hidden">
      <List :items="creatorFetcher.dataList" item-key="id">
        <template #default="{ item }">
          <SearchCreatorCard :item="item" class="mt-20"></SearchCreatorCard>
        </template>
        <template #bottom>
          <NoData v-if="creatorFetcher.noData" :reload="reloadAction"></NoData>
          <div v-else class="flex items-center justify-center py-8 text-gray-a3">
            <Loading v-if="creatorFetcher.isLoading"></Loading>
            <span v-if="creatorFetcher.noMore">{{ $t('common.noMore') }}</span>
          </div>
        </template>
      </List>
    </div>
    <div v-show="activeTab === SEARCH_TAB.POST" class="overflow-x-hidden">
      <div v-if="articleFetcher.isFirstLoading">
        <FeedSkeleton v-for="n in 3" :key="n" class="py-20"></FeedSkeleton>
      </div>
      <List :items="articleFetcher.dataList" item-key="id" divider>
        <template #default="{ item }">
          <Feed class="py-20" :item="item"></Feed>
        </template>
        <template #bottom>
          <NoData v-if="articleFetcher.noData" :reload="reloadAction"></NoData>
          <div v-else class="flex items-center justify-center py-8 text-gray-a3">
            <Loading v-if="articleFetcher.isLoading"></Loading>
            <span v-if="articleFetcher.noMore">{{ $t('common.noMore') }}</span>
          </div>
        </template>
      </List>
    </div>
  </div>
</template>
<script setup>
import { storeToRefs } from 'pinia'
import { useSearchStore } from '@/store/search'
import SearchCreatorCard from '@comp/card/SearchCreatorCard.vue'
import NoData from '@comp/info/NoData.vue'
import Feed from '@comp/main/Feed.vue'
import FeedSkeleton from '@comp/skeleton/Feed.vue'
import { SEARCH_TAB } from '@const'

const searchStore = useSearchStore()
const { activeTab, articleFetcher, creatorFetcher, reloadAction } = storeToRefs(searchStore)
</script>
