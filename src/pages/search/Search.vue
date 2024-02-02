<template>
  <Page infinite @load="nextFn">
    <template #app-top>
      <TopSearchBar :logo="isMobile" @update:keyword="(v) => (keyword = v)" @trigger:search="onSearch"></TopSearchBar>
    </template>
    <template #main-top>
      <Tab v-model="activeTab" :options="tabOptions"></Tab>
    </template>
    <template #default>
      <div>
        <div v-show="activeTab === SEARCH_TAB.AUTHOR" class="overflow-x-hidden">
          <List :items="creatorList" item-key="id">
            <template #default="{ item, last }">
              <SearchCreatorCard :item="item" class="mt-20"></SearchCreatorCard>
              <div v-if="!last" class="h-1 bg-black opacity-[0.15]"></div>
            </template>
            <template #bottom>
              <div class="flex items-center justify-center py-8 text-gray-a3">
                <Loading v-if="creatorLoading"></Loading>
                <span v-if="creatorNoMore"></span>
                {{ $t('common.noMore') }}
              </div>
            </template>
          </List>
        </div>
        <div v-show="activeTab === SEARCH_TAB.POST" class="overflow-x-hidden">
          <List :items="articleList" item-key="id">
            <template #default="{ item, last }">
              <Feed class="py-20" :item="item"></Feed>
              <div v-if="!last" class="h-1 bg-black opacity-[0.15]"></div>
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
    <template #aside>
      <ClientOnly>
        <div class="mt-20">
          <RelCreatorsCard></RelCreatorsCard>
          <BulletinCard class="mt-20"></BulletinCard>
          <Carousel class="mt-30" interval-time></Carousel>
        </div>
      </ClientOnly>
    </template>
  </Page>
</template>

<script setup>
import debounce from 'lodash/debounce'
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/store/app'
import { useHydrationStore } from '@/store/hydration'
import BulletinCard from '@comp/card/BulletinCard.vue'
import RelCreatorsCard from '@comp/card/RelCreatorsCard.vue'
import SearchCreatorCard from '@comp/card/SearchCreatorCard.vue'
import Carousel from '@comp/common/Carousel.vue'
import ClientOnly from '@comp/common/ClientOnly'
import List from '@comp/common/List.vue'
import Feed from '@comp/main/Feed.vue'
import Tab from '@comp/navigation/Tab.vue'
import TopSearchBar from '@comp/navigation/TopSearchBar.vue'
import { onHydration, onServerClientOnce } from '@use/lifecycle'
import { useInfinite } from '@use/request/infinite'
import { SEARCH_TAB } from '@const'

const { t: $t } = useI18n()

const appStore = useAppStore()
const { isMobile } = storeToRefs(appStore)

const activeTab = ref(SEARCH_TAB.AUTHOR)
const tabOptions = [
  { label: 'tab.relatedAuthor', value: SEARCH_TAB.AUTHOR },
  { label: 'tab.relatedPost', value: SEARCH_TAB.POST },
]

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

const nextFn = computed(() => (activeTab.value === SEARCH_TAB.AUTHOR ? creatorNext : articleNext))

watch(
  activeTab,
  (v) => {
    if (v === SEARCH_TAB.POST && articleList.value.length === 0) articleInit()
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

const keyword = ref('')
const reloadFn = computed(() => (activeTab.value === SEARCH_TAB.AUTHOR ? creatorReload : articleReload))
const onSearch = debounce(() => {
  console.log('onSearch')
  if (keyword.value === '') return
  reloadFn.value({ newParams: { keyword: keyword.value } })
}, 500)

watch(
  keyword,
  debounce((v) => {
    if (v === '') reloadFn.value({ newParams: {} })
  }, 500),
)
</script>
