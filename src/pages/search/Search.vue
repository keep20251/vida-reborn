<template>
  <Page infinite @load="nextAction" :pull-to-reload="hasQuery" @reload="reloadAction" :scroll-to-top-signal="keyword">
    <template #app-top>
      <div class="search-header">
        <TopSearchBar :input-value="keyword" :logo="isMobile" to-search auto-trigger></TopSearchBar>
      </div>
    </template>
    <template #main-top v-if="hasQuery">
      <Tab v-model="activeTab" :options="tabOptions" class="search-tabs"></Tab>
    </template>
    <template #default>
      <div class="search-content">
        <SearchResult v-if="hasQuery"></SearchResult>
        <template v-else>
          <p class="font-bold my-30">搜索</p>
          <NoSubscripeCard :showWelcome="false" :showBottom="false" class="" ></NoSubscripeCard>
          <SearchHistory class="mt-30"></SearchHistory>
        </template>
      </div>
    </template>
    <template #aside>
      <ClientOnly>
        <div class="mt-20 search-aside">
          <RelCreatorsCard></RelCreatorsCard>
          <BulletinCard class="mt-20"></BulletinCard>
          <Carousel class="mt-30" interval-time :label="$t('label.eventAd')"></Carousel>
          <NoSubscripeCard :showWelcome="false" class="mt-20"></NoSubscripeCard>
        </div>
      </ClientOnly>
    </template>
  </Page>
</template>
<script setup>
import { onActivated, onDeactivated, onServerPrefetch, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import SearchHistory from '@/pages/search/SearchHistory.vue'
import SearchResult from '@/pages/search/SearchResult.vue'
import { useAccountStore } from '@/store/account'
import { useAppStore } from '@/store/app'
import { useHeadStore } from '@/store/head'
import { useHydrationStore } from '@/store/hydration'
import { useSearchStore } from '@/store/search'
import BulletinCard from '@comp/aside/BulletinCard.vue'
import RelCreatorsCard from '@comp/aside/RelCreatorsCard.vue'
import NoSubscripeCard from '@comp/card/NoSubscripeCard.vue'
import Carousel from '@comp/common/Carousel.vue'
import Tab from '@comp/navigation/Tab.vue'
import TopSearchBar from '@comp/navigation/TopSearchBar.vue'
import { SEARCH_TAB } from '@const'
import { whenNavSearchAgain } from '@/utils/nav-again'
import { onHydration, onServerClientOnce } from '@/compositions/lifecycle'

const appStore = useAppStore()
const { isMobile } = storeToRefs(appStore)

const accountStore = useAccountStore()
const { isLoggedIn } = storeToRefs(accountStore)

const searchStore = useSearchStore()
const { setKeyword, reset } = searchStore
const { activeTab, nextAction, keyword, hasQuery, articleFetcher, reloadAction, requestParams } =
  storeToRefs(searchStore)

const tabOptions = [
  { label: 'tab.relatedPost', value: SEARCH_TAB.POST },
  { label: 'tab.relatedAuthor', value: SEARCH_TAB.AUTHOR },
]

watch(activeTab, () => reloadAction.value({ newParams: requestParams.value }))

const { t: $t } = useI18n()
const headStore = useHeadStore()
const { setup: setupHead, reset: resetHead } = headStore
async function loadSeoHead() {
  const withinKeyword = {
    title: { key: 'meta.searchResult.title', params: { keyword: keyword.value } },
    description: { key: 'meta.searchResult.description', params: { keyword: keyword.value } },
    keywords: { key: 'meta.searchResult.keywords', params: { keyword: keyword.value } },
  }
  const withoutKeyword = {
    title: { key: 'meta.search.title' },
    description: { key: 'meta.search.description' },
    keywords: { key: 'meta.search.keywords' },
  }

  await setupHead({
    ...(hasQuery.value ? withinKeyword : withoutKeyword),
    url: `/search`,
  })
}
onServerPrefetch(loadSeoHead)
onActivated(loadSeoHead)
watch(hasQuery, loadSeoHead)
onDeactivated(resetHead)

const { relatedFeeds, keyword: hydrationKeyword } = storeToRefs(useHydrationStore())

const route = useRoute()
onServerClientOnce(async (isSSR) => {
  if (isSSR) {
    setKeyword(route.query.q)
    if (!keyword.value) return
    await articleFetcher.value.reload({ newParams: requestParams.value })
    hydrationKeyword.value = keyword.value
    relatedFeeds.value = articleFetcher.value.dataList
  }
})
onHydration(() => {
  setKeyword(hydrationKeyword.value)
  if (!keyword.value) return
  articleFetcher.value.revert({ dataList: relatedFeeds.value }, { newParams: requestParams.value })
})

whenNavSearchAgain(reset)
</script>

<style lang="scss" scoped>
.search-header {
  @apply w-full px-20;
}

.search-tabs {
  @apply bg-white px-20 py-10;
}

.search-content {
  @apply py-10;
}

.search-aside {
  @apply px-20;
}
</style>
