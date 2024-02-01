<template>
  <Page>
    <template #main-top>
      <Head :title="creator?.nickname"></Head>
    </template>
    <template #default>
      <div v-if="creator">
        <SelfIntro :item="creator" show-bg-data show-all-info show-personal-info></SelfIntro>
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
      <div v-else-if="error">{{ error }}</div>
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
import Feed from '@comp/main/Feed.vue'
import SelfIntro from '@comp/main/SelfIntro.vue'
import Head from '@comp/navigation/Head.vue'
import { onHydration, onServerClientOnce } from '@use/lifecycle'
import { useInfinite } from '@use/request/infinite'

const feedStore = useFeedStore()
const {
  dataList: items,
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
const error = ref('')
async function loadNewCreator() {
  creator.value = null
  try {
    creator.value = await getCreator(route.params.username)
    await reload({ newParams: { uuid: creator.value.uuid } })
  } catch (e) {
    error.value = e.message
  }
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
    creatorArticleList.value = items.value
    creatorError.value = error.value
  }
})
onHydration(() => {
  creator.value = revertCreator(creatorFromStore.value)
  revert(creatorArticleList.value)
  error.value = creatorError.value
})
</script>
