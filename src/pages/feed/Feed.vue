<template>
  <Page infinite @load="nextComments">
    <template #main-top>
      <Head title="貼文"></Head>
    </template>
    <template #default>
      <div v-if="feed" position="relative">
        <Feed class="mb-24" :item="feed" disable-to-detail disable-content-fold></Feed>
        <List :items="comments" item-key="id">
          <template #default="{ item }">
            <Comment :item="item"></Comment>
          </template>
          <template #bottom>
            <div class="flex items-center justify-center py-8 text-gray-a3">
              <Loading v-if="isCommentsLoading"></Loading>
              <span v-if="commentsNoMore">{{ $t('common.noMore') }}</span>
            </div>
          </template>
        </List>
        <div class="sticky bottom-0 w-full bg-white pb-16">
          <InputWrap v-model="commentInput" append-icon-btn="sendWhite" @click:append="sendComment"></InputWrap>
        </div>
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
import List from '@comp/common/List.vue'
import InputWrap from '@comp/form/InputWrap.vue'
import Error from '@comp/info/Error.vue'
import Feed from '@comp/main/Feed.vue'
import Comment from '@comp/message/Comment.vue'
import Head from '@comp/navigation/Head.vue'
import { onHydration, onServerClientOnce } from '@use/lifecycle'
import useRequest from '@use/request'
import { useInfinite } from '@use/request/infinite'

const { t: $t } = useI18n()
const route = useRoute()

const feedStore = useFeedStore()
const { get: getFeed, revert: revertFeed } = feedStore

const {
  dataList: comments,
  isLoading: isCommentsLoading,
  noMore: commentsNoMore,
  reload: reloadComments,
  revert: revertComments,
  next: nextComments,
} = useInfinite('Comment.list')

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

    await reloadComments({ newParams: { article_id: feed.value.id } })
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
const { feed: feedFromStore, feedComments, feedError } = storeToRefs(hydrationStore)
onServerClientOnce(async (isSSR) => {
  await loadNewFeed()

  if (isSSR) {
    feedFromStore.value = feed.value
    feedComments.value = comments.value
    feedError.value = errMsg.value
  }
})
onHydration(() => {
  feed.value = revertFeed(feedFromStore.value)
  revertComments(feedComments.value, { newParams: { article_id: feed.value.id } })
  errMsg.value = feedError.value
})

const commentInput = ref('')
const { isLoading: isSendCommentLoading, execute: execSendComment } = useRequest('Comment.add')
async function sendComment() {
  if (isSendCommentLoading.value) {
    return
  }

  const content = commentInput.value.trim()

  if (!content) {
    return
  }

  try {
    await execSendComment({ article_id: feed.value.id, content })
    await reloadComments({ newParams: { article_id: feed.value.id } })
    commentInput.value = ''

    feed.value.comment += 1
  } catch (e) {
    console.error(e)
  }
}
</script>
