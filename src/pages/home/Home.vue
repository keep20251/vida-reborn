<template>
  <Page infinite @load="onLoad">
    <template #mobile-top>
      <MobileTopBar feature-icon="filter"></MobileTopBar>
    </template>
    <template #main-top>
      <Tab v-model="tab" :options="tabOptions"></Tab>
    </template>
    <template #default>
      <div v-if="tab === 1">
        <div class="overflow-x-hidden">
          <List :items="items" item-key="id">
            <template #default="{ last }">
              <Feed class="py-20"></Feed>
              <div v-if="!last" class="h-1 bg-black opacity-[0.15]"></div>
            </template>
            <template #bottom>
              <div class="text-gray-a3 flex items-center justify-center py-8">
                <Loading></Loading>{{ $t('common.noMore') }}
              </div>
            </template>
          </List>
        </div>
      </div>
      <div v-else-if="tab === 2">
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
import { useHeadStore } from '@/store/head'
import BulletinCard from '@comp/card/BulletinCard.vue'
import RecCard from '@comp/card/RecCard.vue'
import ViewSubscribeCard from '@comp/card/ViewSubscribeCard.vue'
import Carousel from '@comp/common/Carousel.vue'
import List from '@comp/common/List.vue'
import InputWrap from '@comp/form/InputWrap.vue'
import Feed from '@comp/main/Feed.vue'
import MobileTopBar from '@comp/navigation/MobileTopBar.vue'
import Tab from '@comp/navigation/Tab.vue'

const items = ref([{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }])

const tab = ref(1)
const tabOptions = ref([
  { label: 'common.recommand', value: 1 },
  { label: 'common.subscribe', value: 2 },
])

const searchValue = ref('')

function onLoad() {
  console.log('load at', new Date())
}

const { reset: resetHeadStore } = useHeadStore()

onServerPrefetch(() => {
  resetHeadStore()
})

onActivated(() => {
  resetHeadStore()
})
</script>
