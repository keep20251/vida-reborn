<template>
  <Page infinite @load="nextArticleList">
    <template #main-top>
      <Head :title="creator?.nickname"></Head>
    </template>
    <template #default>
      <div v-if="creator">
        <SelfIntro :item="creator" show-bg-data show-all-info show-personal-info></SelfIntro>
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
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { whenever } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { useCreatorStore } from '@/store/creator'
import { useFeedStore } from '@/store/feed'
import { useHydrationStore } from '@/store/hydration'
import List from '@comp/common/List.vue'
import Error from '@comp/info/Error.vue'
import Feed from '@comp/main/Feed.vue'
import SelfIntro from '@comp/main/SelfIntro.vue'
import Head from '@comp/navigation/Head.vue'
import { onHydration, onServerClientOnce } from '@use/lifecycle'
import { useInfinite } from '@use/request/infinite'

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
    await reload({ newParams: { uuid: creator.value.uuid } })
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
