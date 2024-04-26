<template>
  <Page infinite @load="onPageEnd" :pull-to-reload="tab === TAB_TYPE.REC" @reload="reload">
    <template v-if="isMobile" #app-top>
      <TopSearchBar logo feature-icon="filter" to-search @feature="updateIntesreted"></TopSearchBar>
    </template>
    <template #main-top>
      <Tab v-model="tab" :options="tabOptions" :feature="isDesktop ? 'filter' : ''" @feature="updateIntesreted"></Tab>
    </template>
    <template #default>
      <div v-show="tab === TAB_TYPE.REC">
        <List :items="items" item-key="id" divider>
          <template #default="{ item }">
            <Feed class="py-20" :item="item"></Feed>
          </template>
          <template #bottom>
            <div class="flex items-center justify-center py-8 text-gray-a3">
              <Loading v-if="isLoading"></Loading>
              <span v-if="noMore">{{ $t('common.noMore') }}</span>
            </div>
          </template>
        </List>
      </div>
      <div v-show="tab === TAB_TYPE.SUB" :class="{ 'h-[calc(100vh-12.75rem)]': isMobile }">
        <PopCreatorSwiper
          v-if="isMobile"
          :items="creators"
          @load="creatorsNext"
          @reload="creatorsReload"
        ></PopCreatorSwiper>
        <div v-else>
          <div class="flex justify-between pt-20">
            <div class="text-base font-bold leading-md">{{ $t('info.popularCreator') }}</div>
          </div>
          <div class="pt-10 text-base font-normal leading-md">{{ $t('info.subscribeToView') }}</div>
          <List :items="creators" item-key="aff">
            <template #default="{ item, index }">
              <ViewSubscribeCard class="my-5" :item="item" :theme="(index + 2) % 3"></ViewSubscribeCard>
            </template>
            <template #bottom>
              <div class="flex items-center justify-center py-8 text-gray-a3">
                <Loading v-if="creatorsIsLoading"></Loading>
                <span v-if="creatorsNoMore">{{ $t('common.noMore') }}</span>
              </div>
            </template>
          </List>
        </div>
      </div>
    </template>
    <template #aside-top>
      <TopSearchBar to-search></TopSearchBar>
    </template>
    <template #aside>
      <ClientOnly>
        <div>
          <BulletinCard class="mt-20"></BulletinCard>
          <RecCard class="mt-10"></RecCard>
          <Carousel class="mt-20" interval-time :label="$t('label.eventAd')"></Carousel>
        </div>
      </ClientOnly>
    </template>
  </Page>
</template>

<script setup>
import { ref } from 'vue'
import { useLocalStorage, watchOnce, whenever } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { useAccountStore } from '@/store/account'
import { useAppStore } from '@/store/app'
import { useFeedStore } from '@/store/feed'
import { useHydrationStore } from '@/store/hydration'
import { useModalStore } from '@/store/modal'
import BulletinCard from '@comp/aside/BulletinCard.vue'
import RecCard from '@comp/aside/RecCard.vue'
import PopCreatorSwiper from '@comp/card/PopCreatorSwiper.vue'
import ViewSubscribeCard from '@comp/card/ViewSubscribeCard.vue'
import Carousel from '@comp/common/Carousel.vue'
import Feed from '@comp/main/Feed.vue'
import Tab from '@comp/navigation/Tab.vue'
import TopSearchBar from '@comp/navigation/TopSearchBar.vue'
import { onHydration, onServerClientOnce } from '@use/lifecycle'
import useRequest from '@use/request/index.js'
import { useInfinite } from '@use/request/infinite'
import { LOCAL_STORAGE_KEYS, MODAL_TYPE } from '@const'
import { TAB_TYPE } from '@const/home'

const appStore = useAppStore()
const { isDesktop, isMobile } = storeToRefs(appStore)

const feedStore = useFeedStore()
const {
  dataList: items,
  dataExtra,
  isLoading,
  noMore,
  init,
  revert,
  next,
  reload,
} = useInfinite('Article.list', {
  params: { filter_by: 0, user_interested: 1, include_my_article: 1 },
  transformer: feedStore.sync,
})

const tab = ref(TAB_TYPE.REC)
const tabOptions = ref([
  { label: 'tab.recommand', value: TAB_TYPE.REC },
  { label: 'tab.subscribe', value: TAB_TYPE.SUB },
])

const hydrationStore = useHydrationStore()
const { forYou } = storeToRefs(hydrationStore)
onServerClientOnce(async (isSSR) => {
  await init()
  if (isSSR) {
    forYou.value = { dataList: items.value, dataExtra: dataExtra.value }
  }
})
onHydration(() => {
  revert(forYou.value)
})

const {
  dataList: creators,
  isLoading: creatorsIsLoading,
  noMore: creatorsNoMore,
  init: creatorsInit,
  next: creatorsNext,
  reload: creatorsReload,
} = useInfinite('User.searchCreator')
watchOnce(tab, (tab) => {
  if (tab === TAB_TYPE.SUB) {
    creatorsInit()
  }
})

function onPageEnd() {
  if (tab.value === TAB_TYPE.REC) {
    next()
  }
  if (tab.value === TAB_TYPE.SUB) {
    creatorsNext()
  }
}

const interestedList = useLocalStorage(LOCAL_STORAGE_KEYS.INTERESTED_LIST, [])
const accountStore = useAccountStore()
const { isLogin, userData } = storeToRefs(accountStore)
const { updateUserData } = accountStore
const modalStore = useModalStore()
const { open } = modalStore
function updateIntesreted() {
  const content = isLogin.value ? userData.value.interested.split(',') : interestedList.value
  open(MODAL_TYPE.INTERESTED_PICK, {
    size: 'xl',
    content,
    async confirmAction(data) {
      if (isLogin.value) {
        const interested = data.join(',')
        try {
          await useRequest('User.modifyInfo', { params: { interested }, immediate: true })
          updateUserData({ interested })
        } catch (e) {
          return e.message
        }
      } else {
        interestedList.value = data
      }

      reload()
      creatorsReload()
    },
    showClose: true,
  })
}

whenever(isLogin, () => {
  reload()
  creatorsReload()
})
</script>
