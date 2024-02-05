<template>
  <Page>
    <template #main-top>
      <Head title="貼文"></Head>
    </template>
    <template #default>
      <div v-if="feed">
        <Feed :item="feed" disable-to-detail disable-content-fold></Feed>
      </div>
      <Error v-else-if="errMsg" :message="errMsg"></Error>
      <Loading v-else></Loading>
    </template>
  </Page>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { whenever } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { useFeedStore } from '@/store/feed'
import { useHydrationStore } from '@/store/hydration'
import Error from '@comp/info/Error.vue'
import Feed from '@comp/main/Feed.vue'
import Head from '@comp/navigation/Head.vue'
import { onHydration, onServerClientOnce } from '@use/lifecycle'

const { t: $t } = useI18n()
const route = useRoute()

const feedStore = useFeedStore()
const { get: getFeed, revert: revertFeed } = feedStore

const feed = ref(null)
const errMsg = ref(null)
async function loadNewFeed() {
  feed.value = null
  errMsg.value = null
  try {
    let id = route.params.feedId
    if (/^\d+$/.test(id)) {
      id = parseInt(id)
    } else {
      errMsg.value = $t('content.feedNotExist')
      return
    }

    const feedData = await getFeed(id)

    // 帖子 username 與 route 參數的 username 不一致必須當成是錯的
    if (feedData.user.username !== route.params.username) {
      errMsg.value = $t('content.feedNotExist')
      return
    }

    feed.value = feedData
  } catch (e) {
    errMsg.value = e.message
  }
}

whenever(
  () => route.name === 'feed',
  async (v) => {
    if (route.params.feedId !== feed.value?.id) {
      await loadNewFeed()
    }
  },
)

// hydration
const hydrationStore = useHydrationStore()
const { feed: feedFromStore, feedError } = storeToRefs(hydrationStore)
onServerClientOnce(async (isSSR) => {
  await loadNewFeed()

  if (isSSR) {
    feedFromStore.value = feed.value
    feedError.value = errMsg.value
  }
})
onHydration(() => {
  feed.value = revertFeed(feedFromStore.value)
  errMsg.value = feedError.value
})
</script>
