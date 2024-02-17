<template>
  <Page infinite @load="nextArticleList" main-top-toggle-disabled>
    <template #main-top>
      <Head :title="creator?.nickname"></Head>
    </template>
    <template #default>
      <div v-if="creator">
        <SelfIntro :item="creator" show-bg-data show-all-info show-personal-info>
          <template #topButton>
            <div class="flex items-center space-x-10">
              <div class="cursor-pointer"><Icon name="comment" size="20"></Icon></div>
              <div class="cursor-pointer"><Icon name="report" size="20"></Icon></div>
              <div class="cursor-pointer"><Icon name="sharePage" size="20"></Icon></div>
              <Button size="sm" primary @click="subscribe(lowestSub)">
                {{ $t('common.subscribe') }}
              </Button>
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
import Button from '@comp/common/Button.vue'
import Error from '@comp/info/Error.vue'
import Feed from '@comp/main/Feed.vue'
import SelfIntro from '@comp/main/SelfIntro.vue'
import Head from '@comp/navigation/Head.vue'
import { onHydration, onServerClientOnce } from '@use/lifecycle'
import { useDialog } from '@use/modal'
import { useInfinite } from '@use/request/infinite'

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
const lowestSub = computed(() =>
  creator.value?.subscription_list?.reduce((acc, cur) => (Number(acc.price) < Number(cur.price) ? acc : cur)),
)

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
