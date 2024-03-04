<template>
  <Page infinite @load="nextAction">
    <template #app-top>
      <TopSearchBar :input-value="keyword" :logo="isMobile" to-search @search="(v) => (keyword = v)"></TopSearchBar>
    </template>
    <template #main-top>
      <Tab v-if="hasQuery" v-model="activeTab" :options="tabOptions"></Tab>
    </template>
    <template #default>
      <SearchResult v-if="hasQuery"></SearchResult>
      <SearchHistory v-else></SearchHistory>
    </template>
    <template #aside>
      <ClientOnly>
        <div class="mt-20">
          <RelCreatorsCard></RelCreatorsCard>
          <BulletinCard class="mt-20"></BulletinCard>
          <Carousel class="mt-30" interval-time :label="$t('label.eventAd')"></Carousel>
        </div>
      </ClientOnly>
    </template>
  </Page>
</template>
<script setup>
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import SearchHistory from '@/pages/search/SearchHistory.vue'
import SearchResult from '@/pages/search/SearchResult.vue'
import { useAppStore } from '@/store/app'
import { useSearchStore } from '@/store/search'
import BulletinCard from '@comp/aside/BulletinCard.vue'
import RelCreatorsCard from '@comp/aside/RelCreatorsCard.vue'
import Carousel from '@comp/common/Carousel.vue'
import Tab from '@comp/navigation/Tab.vue'
import TopSearchBar from '@comp/navigation/TopSearchBar.vue'
import { SEARCH_TAB } from '@const'

const route = useRoute()
const hasQuery = computed(() => Object.keys(route.query).length > 0)

const appStore = useAppStore()
const { isMobile } = storeToRefs(appStore)

const searchStore = useSearchStore()
const { reset } = searchStore
const { activeTab, nextAction, keyword } = storeToRefs(searchStore)

const tabOptions = [
  { label: 'tab.relatedPost', value: SEARCH_TAB.POST },
  { label: 'tab.relatedAuthor', value: SEARCH_TAB.AUTHOR },
]

watch(hasQuery, (v) => {
  if (!v) reset()
})
</script>
