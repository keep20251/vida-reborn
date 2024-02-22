<template>
  <Page infinite @load="nextArticleList" main-top-toggle-disabled>
    <template #main-top>
      <Head :title="creator?.nickname"></Head>
    </template>
    <template #default>
      <div v-if="creator">
        <SelfIntro :item="creator" show-bg-data show-all-info show-personal-info>
          <template #topButton>
            <div class="flex w-full items-center justify-between pl-100">
              <div class="flex items-center space-x-10">
                <SocialIcon name="instagram" :url="creator?.facebook_link" size="15"></SocialIcon>
                <SocialIcon name="facebook" :url="creator?.instagram_link" size="15"></SocialIcon>
                <SocialIcon name="twitter" :url="creator?.twitter_link" size="15"></SocialIcon>
                <SocialIcon name="youtube" :url="creator?.youtube_link" size="15"></SocialIcon>
                <SocialIcon name="tiktok" :url="creator?.tiktok_link" size="15"></SocialIcon>
              </div>
              <div class="flex items-center space-x-10">
                <div class="flex cursor-pointer items-center" @click="toMessage(creator?.username)">
                  <Icon name="comment" size="20"></Icon>
                </div>
                <div class="flex cursor-pointer items-center"><Icon name="report" size="20"></Icon></div>
                <div class="flex cursor-pointer items-center"><Icon name="sharePage" size="20"></Icon></div>
                <Button size="sm" primary @click="subscribe({ item: lowestSub, creator })">
                  {{ $t('common.subscribe') }}
                </Button>
              </div>
            </div>
          </template>
          <template #bottomButton>
            <div class="flex w-full flex-row items-center space-x-12">
              <Button primary @click="open({ items: creator?.subscription_list, creator })">
                {{ $t('common.viewSubscribePlan') }}
              </Button>
              <div class="cursor-pointer" @click="toMessage(creator?.username)">
                <Icon name="messagePrimary" size="36"></Icon>
              </div>
            </div>
          </template>
        </SelfIntro>
        <div
          class="sticky z-10 flex h-36 w-full items-center bg-gray-f6 px-20 text-base font-bold"
          :class="{ 'top-44': isMobile, 'top-52': isDesktop }"
        >
          {{ $t('content.allPosts') }} {{ creator.post_num }}
        </div>
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
      <Error v-else-if="errMsg" :message="errMsg"></Error>
      <Loading v-else></Loading>
    </template>
    <template #aside-top>
      <TopSearchBar to-search></TopSearchBar>
    </template>
    <template #aside>
      <div v-if="creator">
        <div class="text-lg font-bold">{{ $t('title.subscription') }}</div>
        <List :items="creator.subscription_list" item-key="id" divider>
          <template #default="{ item }">
            <SubscribeCard class="py-20" :item="item" @click="subscribe({ item, creator })"></SubscribeCard>
          </template>
        </List>
      </div>
    </template>
  </Page>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { whenever } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/store/app'
import { useCreatorStore } from '@/store/creator'
import { useFeedStore } from '@/store/feed'
import { useHydrationStore } from '@/store/hydration'
import { useSubsciptionStore } from '@/store/subscription'
import SubscribeCard from '@comp/card/SubscribeCard.vue'
import Button from '@comp/common/Button.vue'
import SocialIcon from '@comp/common/SocialIcon.vue'
import Error from '@comp/info/Error.vue'
import Feed from '@comp/main/Feed.vue'
import SelfIntro from '@comp/main/SelfIntro.vue'
import Head from '@comp/navigation/Head.vue'
import TopSearchBar from '@comp/navigation/TopSearchBar.vue'
import { onHydration, onServerClientOnce } from '@use/lifecycle'
import { useDialog } from '@use/modal'
import { useInfinite } from '@use/request/infinite'
import { useRouters } from '@use/routers'

const appStore = useAppStore()
const { isDesktop, isMobile } = storeToRefs(appStore)

const feedStore = useFeedStore()
const {
  dataList: items,
  dataExtra,
  isLoading,
  noMore,
  revert,
  reload,
  next,
} = useInfinite('Article.list', {
  transformer: feedStore.sync,
})

const route = useRoute()

const creatorStore = useCreatorStore()
const { get: getCreator, revert: revertCreator } = creatorStore

const creator = ref(null)
const errMsg = ref(null)
async function loadNewCreator() {
  creator.value = null
  try {
    creator.value = await getCreator(route.params.username)
    await reload({ newParams: { uuid: creator.value.uuid, filter_by: 0 } })
  } catch (e) {
    errMsg.value = e.message
  }
}
function nextArticleList() {
  if (creator.value === null) {
    return
  }
  next()
}

const { subscribe } = useDialog()
const { open } = useSubsciptionStore()
const lowestSub = computed(() =>
  creator.value?.subscription_list?.reduce((acc, cur) => (Number(acc.price) < Number(cur.price) ? acc : cur)),
)

const { toMessage } = useRouters()

whenever(
  () => route.name === 'creator',
  async (v) => {
    if (route.params.username !== creator.value?.username) {
      await loadNewCreator()
    }
  },
)

// hydration
const hydrationStore = useHydrationStore()
const { creator: creatorFromStore, creatorArticleList, creatorError } = storeToRefs(hydrationStore)
onServerClientOnce(async (isSSR) => {
  await loadNewCreator()

  if (isSSR) {
    creatorFromStore.value = creator.value
    creatorArticleList.value = { dataList: items.value, dataExtra: dataExtra.value }
    creatorError.value = errMsg.value
  }
})
onHydration(() => {
  creator.value = revertCreator(creatorFromStore.value)
  revert(creatorArticleList.value, { newParams: { uuid: creator.value.uuid } })
  errMsg.value = creatorError.value
})
</script>
