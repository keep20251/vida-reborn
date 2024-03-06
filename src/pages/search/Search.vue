<template>
  <Page infinite @load="nextAction">
    <template #app-top>
      <TopSearchBar v-model="keyword" :logo="isMobile" to-search @search="setKeyword"></TopSearchBar>
    </template>
    <template #main-top v-if="hasQuery">
      <Tab v-model="activeTab" :options="tabOptions"></Tab>
    </template>
    <template #default>
      <SearchResult v-if="hasQuery"></SearchResult>
      <SearchHistory v-else class="mt-20"></SearchHistory>
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
import { computed, onActivated, onDeactivated, onServerPrefetch, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import SearchHistory from '@/pages/search/SearchHistory.vue'
import SearchResult from '@/pages/search/SearchResult.vue'
import { useAppStore } from '@/store/app'
import { useHeadStore } from '@/store/head'
import { useSearchStore } from '@/store/search'
import BulletinCard from '@comp/aside/BulletinCard.vue'
import RelCreatorsCard from '@comp/aside/RelCreatorsCard.vue'
import Carousel from '@comp/common/Carousel.vue'
import Tab from '@comp/navigation/Tab.vue'
import TopSearchBar from '@comp/navigation/TopSearchBar.vue'
import { SEARCH_TAB } from '@const'

const appStore = useAppStore()
const { isMobile } = storeToRefs(appStore)

const searchStore = useSearchStore()
const { reset, setKeyword } = searchStore
const { activeTab, nextAction, keyword } = storeToRefs(searchStore)

const tabOptions = [
  { label: 'tab.relatedPost', value: SEARCH_TAB.POST },
  { label: 'tab.relatedAuthor', value: SEARCH_TAB.AUTHOR },
]

const route = useRoute()
const hasQuery = computed(() => Object.keys(route.query).length > 0)

watch(hasQuery, (v) => {
  if (!v) reset()
})

const { t: $t } = useI18n()
const headStore = useHeadStore()
const { setup: setupHead, reset: resetHead } = headStore
async function loadSeoHead() {
  await setupHead({
    title: $t('meta.search.title'),
    description: $t('meta.search.description'),
    keywords: [$t('meta.search.keywords')],
    url: `/search`,
  })
}
onServerPrefetch(loadSeoHead)
onActivated(loadSeoHead)
onDeactivated(resetHead)
</script>
