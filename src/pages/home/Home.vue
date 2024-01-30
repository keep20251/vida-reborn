<template>
  <Page infinite @load="next">
    <template #mobile-top>
      <MobileTopBar feature-icon="filter"></MobileTopBar>
    </template>
    <template #main-top>
      <Tab v-model="tab" :options="tabOptions"></Tab>
    </template>
    <template #default>
      <div v-if="tab === TAB_TYPE.REC">
        <div class="overflow-x-hidden">
          <List :items="items" item-key="id">
            <template #default="{ item, last }">
              <Feed class="py-20" :item="item"></Feed>
              <div v-if="!last" class="h-1 bg-black opacity-[0.15]"></div>
            </template>
            <template #bottom>
              <div class="flex items-center justify-center py-8 text-gray-a3">
                <Loading v-if="isLoading"></Loading>
                <span v-if="noMore">{{ $t('common.noMore') }}</span>
              </div>
            </template>
          </List>
        </div>
      </div>
      <div v-else-if="tab === TAB_TYPE.SUB">
        <div class="flex justify-between pt-20">
          <div class="text-base font-bold leading-md">Popular Creator</div>
          <Icon name="filter" size="20" class="cursor-pointer"></Icon>
        </div>
        <div class="pt-10 text-base font-normal leading-md">订阅某个账号，以查看其最新帖子</div>
        <div class="flex flex-col justify-center space-y-10 pt-30">
          <ViewSubscribeCard
            v-for="index in 3"
            :key="`creator-card-${index}`"
            :theme="(index + 2) % 3"
          ></ViewSubscribeCard>
        </div>
      </div>
    </template>
    <template #aside-top>
      <div class="flex h-full items-center">
        <InputWrap
          class="grow"
          v-model="searchValue"
          :placeholder="'搜索...'"
          appendIcon="search2"
          @click:append="console.log('appendIcon')"
        ></InputWrap>
      </div>
    </template>
    <template #aside>
      <ClientOnly>
        <div>
          <BulletinCard class="mt-20"></BulletinCard>
          <RecCard class="mt-10" :button-text="$t('common.check')"></RecCard>
          <Carousel class="mt-20" interval-time></Carousel>
        </div>
      </ClientOnly>
    </template>
  </Page>
</template>

<script setup>
import { onActivated, onServerPrefetch, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useFeedStore } from '@/store/feed'
import { useHeadStore } from '@/store/head'
import { useHydrationStore } from '@/store/hydration'
import BulletinCard from '@comp/card/BulletinCard.vue'
import RecCard from '@comp/card/RecCard.vue'
import ViewSubscribeCard from '@comp/card/ViewSubscribeCard.vue'
import Carousel from '@comp/common/Carousel.vue'
import List from '@comp/common/List.vue'
import InputWrap from '@comp/form/InputWrap.vue'
import Feed from '@comp/main/Feed.vue'
import MobileTopBar from '@comp/navigation/MobileTopBar.vue'
import Tab from '@comp/navigation/Tab.vue'
import { onHydration, onServerClientOnce } from '@use/lifecycle'
import { useInfinite } from '@use/request/infinite'
import { TAB_TYPE } from '@const/home'

const feedStore = useFeedStore()
const {
  dataList: items,
  isLoading,
  noMore,
  init,
  revert,
  next,
} = useInfinite('Article.list', {
  params: { user_interested: 1, include_my_article: 1 },
  transformer: feedStore.sync,
})

const tab = ref(TAB_TYPE.REC)
const tabOptions = ref([
  { label: 'tab.recommand', value: TAB_TYPE.REC },
  { label: 'tab.subscribe', value: TAB_TYPE.SUB },
])

const searchValue = ref('')

const hydrationStore = useHydrationStore()
const { forYou } = storeToRefs(hydrationStore)
onServerClientOnce(async (isSSR) => {
  await init()
  if (isSSR) {
    forYou.value = items.value
  }
})
onHydration(() => {
  revert(forYou.value)
})

const { reset: resetHeadStore } = useHeadStore()
onServerPrefetch(resetHeadStore)
onActivated(resetHeadStore)
</script>
