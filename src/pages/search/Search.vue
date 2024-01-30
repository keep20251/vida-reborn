<template>
  <Page infinite @load="nextFn">
    <template #mobile-top>
      <div class="bg-white">
        <MobileTopBar @update:keyword="(v) => (keyword = v)" @trigger:search="onSearch"></MobileTopBar>
        <div class="mt-10 h-34 w-full">
          <Tab v-model="activeTab" :options="tabOptions"></Tab>
        </div>
      </div>
    </template>
    <template v-if="isDesktop" #main-top>
      <div class="flex h-full flex-col items-center">
        <InputWrap
          class="w-full"
          v-model="keyword"
          :placeholder="$t('placeholder.search')"
          :appendIcon="'search2'"
          @click:append="onSearch"
          @keypress:enter="onSearch"
        ></InputWrap>
        <Tab v-model="activeTab" :options="tabOptions"></Tab>
      </div>
    </template>
    <template #default>
      <div>
        <div v-show="activeTab === SEARCH_TAB.AUTHOR" class="overflow-x-hidden">
          <List :items="creatorList" item-key="id">
            <template #default="{ item, index, last }">
              <ViewSubscribeCard :item="item" :theme="index % 3" class="mt-20"></ViewSubscribeCard>
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
import ViewSubscribeCard from '@comp/card/ViewSubscribeCard.vue'
import Carousel from '@comp/common/Carousel.vue'
import ClientOnly from '@comp/common/ClientOnly'
import List from '@comp/common/List.vue'
import InputWrap from '@comp/form/InputWrap.vue'
import Feed from '@comp/main/Feed.vue'
import MobileTopBar from '@comp/navigation/MobileTopBar.vue'
import Tab from '@comp/navigation/Tab.vue'
import { onHydration, onServerClientOnce } from '@use/lifecycle'
import { useInfinite } from '@use/request/infinite'
import { SEARCH_TAB } from '@const'

const { t: $t } = useI18n()

const appStore = useAppStore()
const { isDesktop } = storeToRefs(appStore)

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
