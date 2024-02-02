<template>
  <Page infinite @load="nextAction">
    <template #app-top>
      <TopSearchBar :logo="isMobile" @update:keyword="(v) => (keyword = v)" @trigger:search="onSearch"></TopSearchBar>
    </template>
    <template #main-top>
      <Tab v-if="router.name === 'search-result'" v-model="activeTab" :options="tabOptions"></Tab>
    </template>
    <template #default>
      <router-view></router-view>
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
import { watch } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/store/app'
import { useSearchStore } from '@/store/search'
import BulletinCard from '@comp/card/BulletinCard.vue'
import RelCreatorsCard from '@comp/card/RelCreatorsCard.vue'
import Carousel from '@comp/common/Carousel.vue'
import ClientOnly from '@comp/common/ClientOnly'
import Tab from '@comp/navigation/Tab.vue'
import TopSearchBar from '@comp/navigation/TopSearchBar.vue'
import { SEARCH_TAB } from '@const'

const router = useRouter()

const appStore = useAppStore()
const { isMobile } = storeToRefs(appStore)

const searchStore = useSearchStore()
const { activeTab, nextAction, reloadAction, keyword } = storeToRefs(searchStore)

const tabOptions = [
  { label: 'tab.relatedAuthor', value: SEARCH_TAB.AUTHOR },
  { label: 'tab.relatedPost', value: SEARCH_TAB.POST },
]

const onSearch = debounce(() => {
  console.log('onSearch')
  if (keyword.value === '') return
  reloadAction.value({ newParams: { keyword: keyword.value } })
}, 500)

watch(
  keyword,
  debounce((v) => {
    if (v === '') reloadAction.value({ newParams: {} })
  }, 500),
)
</script>
