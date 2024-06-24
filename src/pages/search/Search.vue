<template>
  <Page infinite @load="onPageLoad" :pull-to-reload="!!hasQuery" :watcher="keyword" @reload="reloadAction">
    <template #app-top>
      <TopSearchBar :input-value="keyword" :logo="isMobile" to-search></TopSearchBar>
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
import { useHydrationStore } from '@/store/hydration'
import { useSearchStore } from '@/store/search'
import BulletinCard from '@comp/aside/BulletinCard.vue'
import RelCreatorsCard from '@comp/aside/RelCreatorsCard.vue'
import Carousel from '@comp/common/Carousel.vue'
import Tab from '@comp/navigation/Tab.vue'
import TopSearchBar from '@comp/navigation/TopSearchBar.vue'
import { SEARCH_TAB } from '@const'
import { onHydration, onServerClientOnce } from '@/compositions/lifecycle'

const appStore = useAppStore()
const { isMobile } = storeToRefs(appStore)

const searchStore = useSearchStore()
const { reset, setKeyword, onSearch } = searchStore
const { activeTab, nextAction, keyword, articleFetcher, reloadAction } = storeToRefs(searchStore)

const tabOptions = [
  { label: 'tab.relatedPost', value: SEARCH_TAB.POST },
  { label: 'tab.relatedAuthor', value: SEARCH_TAB.AUTHOR },
]

watch(activeTab, () => reloadAction.value({ newParams: { keyword: keyword.value } }))

const route = useRoute()

const hasQuery = computed(() => route.name === 'search' && route.query.q)

watch(hasQuery, (v) => (v ? onSearch(v) : reset()))

const onPageLoad = computed(() => (hasQuery.value ? nextAction : void 0))

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

const { relatedFeeds, keyword: hydrationKeyword } = storeToRefs(useHydrationStore())

onServerClientOnce(async (isSSR) => {
  setKeyword(route.query.q)
  if (!keyword.value) return
  await articleFetcher.value.reload({ newParams: { keyword: keyword.value } })
  if (isSSR) {
    hydrationKeyword.value = keyword.value
    relatedFeeds.value = articleFetcher.value.dataList
  }
})
onHydration(() => {
  setKeyword(hydrationKeyword.value)
  if (!keyword.value) return
  articleFetcher.value.revert({ dataList: relatedFeeds.value }, { newParams: { keyword: keyword.value } })
})
</script>
