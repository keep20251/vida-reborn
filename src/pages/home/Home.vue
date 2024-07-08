<template>
  <Page infinite @load="onPageEnd" :pull-to-reload="isPullToReloadEnable" @reload="reload">
    <template v-if="isMobile" #app-top>
      <TopSearchBar logo to-search></TopSearchBar>
    </template>
    <template #default>
      <div v-if="hasSubscribe">
        <List :items="feeds" item-key="id" divider>
          <template #default="{ item }">
            <Feed class="py-20" :item="item"></Feed>
          </template>
          <template #bottom>
            <NoData v-if="feedsNoData" :reload="reload"></NoData>
            <div v-else class="flex items-center justify-center py-8 text-gray-a3">
              <Loading v-if="feedsIsLoading"></Loading>
              <span v-if="feedsNoMore">{{ $t('common.noMore') }}</span>
            </div>
          </template>
        </List>
      </div>
      <div v-else ref="creatorsPage">
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
              <NoData v-if="creatorsNoData" :reload="creatorsReload"></NoData>
              <div v-else class="flex items-center justify-center py-8 text-gray-a3">
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
import { computed, ref } from 'vue'
import { useWindowSize, whenever } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { useAccountStore } from '@/store/account'
import { useAppStore } from '@/store/app'
import { useFeedStore } from '@/store/feed'
import { useHydrationStore } from '@/store/hydration'
import BulletinCard from '@comp/aside/BulletinCard.vue'
import RecCard from '@comp/aside/RecCard.vue'
import PopCreatorSwiper from '@comp/card/PopCreatorSwiper.vue'
import ViewSubscribeCard from '@comp/card/ViewSubscribeCard.vue'
import Carousel from '@comp/common/Carousel.vue'
import NoData from '@comp/info/NoData.vue'
import Feed from '@comp/main/Feed.vue'
import TopSearchBar from '@comp/navigation/TopSearchBar.vue'
import { onHydration, onServerClientOnce } from '@use/lifecycle'
import { useInfinite } from '@use/request/infinite'
import { whenNavHomeAgain } from '@/utils/nav-again'

const appStore = useAppStore()
const { isDesktop, isMobile } = storeToRefs(appStore)

const accountStore = useAccountStore()
const { isLogin } = storeToRefs(accountStore)

const feedStore = useFeedStore()
const {
  dataList: feeds,
  dataExtra: feedsDataExtra,
  isLoading: feedsIsLoading,
  noMore: feedsNoMore,
  noData: feedsNoData,
  init: feedsInit,
  revert: feedsRevert,
  next: feedsNext,
  reload: feedsReload,
} = useInfinite('Article.listSubscribe', {
  transformer: feedStore.sync,
})

const {
  dataList: creators,
  dataExtra: creatorsDataExtra,
  isLoading: creatorsIsLoading,
  noMore: creatorsNoMore,
  noData: creatorsNoData,
  init: creatorsInit,
  revert: creatorsRevert,
  next: creatorsNext,
  reload: creatorsReload,
} = useInfinite('User.getNewCreator')

const hasSubscribe = computed(() => isLogin.value && !feedsNoData.value)
const isPullToReloadEnable = computed(() => isMobile.value && hasSubscribe.value)

const hydrationStore = useHydrationStore()
const { homeFeeds, homeCreators } = storeToRefs(hydrationStore)
onServerClientOnce(async (isSSR) => {
  if (isLogin.value) {
    await feedsInit()
  }

  if (hasSubscribe.value) {
    if (isSSR) {
      homeFeeds.value = { dataList: feeds.value, dataExtra: feedsDataExtra.value }
    }
  } else {
    await creatorsInit()
    if (isSSR) {
      homeFeeds.value = { dataList: [] }
      homeCreators.value = { dataList: creators.value, dataExtra: creatorsDataExtra.value }
    }
  }
})
onHydration(() => {
  feedsRevert(homeFeeds.value)
  if (homeCreators.value) {
    creatorsRevert(homeCreators.value)
  }
})

// safari 100vh 的爛坑，只能拿 window height 來算
const creatorsPage = ref(null)
const { height: windowHeight } = useWindowSize()
whenever(
  () => creatorsPage.value && isMobile.value,
  () => (creatorsPage.value.style.height = `calc(${windowHeight.value}px - 9.5rem)`),
  { immediate: true },
)

function onPageEnd() {
  if (hasSubscribe.value) {
    feedsNext()
  } else {
    if (isDesktop.value) {
      creatorsNext()
    }
  }
}

async function reload() {
  if (isLogin.value) {
    await feedsReload()
  }
  if (!hasSubscribe.value) {
    await creatorsReload()
  }
}

whenever(isLogin, reload)
whenNavHomeAgain(reload)

// TODO PM說興趣更新這邊在 VIDA 初期還不需要，所以先註解，但之後很可能會需要加回來
// async function updateIntesreted() {
//   const interestedSplitByComma = isLogin.value
//     ? userData.value.interested
//     : (await useRequest('User.getGuestInterested', { immediate: true }))?.interested
//   const content = commaSplittedToArray(interestedSplitByComma)

//   open(MODAL_TYPE.INTERESTED_PICK, {
//     size: 'xl',
//     content,
//     async confirmAction(data) {
//       const interested = data.join(',')
//       try {
//         if (isLogin.value) {
//           await useRequest('User.modifyInfo', { params: { interested }, immediate: true })
//           updateUserData({ interested })
//         } else {
//           await useRequest('User.setGuestInterested', { params: { interested }, immediate: true })
//         }
//       } catch (e) {
//         return e.message
//       }

//       reload()
//       creatorsReload()
//     },
//     showClose: true,
//   })
// }
</script>
