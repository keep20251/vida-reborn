<template>
  <Page infinite @load="nextComments">
    <template #main-top>
      <Head title="貼文" @back="clearInput"></Head>
    </template>
    <template #default>
      <div v-if="feed" position="relative">
        <Feed class="mb-24" :item="feed" disable-to-detail disable-content-fold></Feed>
        <List :items="comments" item-key="id">
          <template #default="{ item }">
            <Comment :item="item" @reply="onReply"></Comment>
          </template>
          <template #bottom>
            <div class="flex items-center justify-center py-8 text-gray-a3">
              <Loading v-if="isCommentsLoading"></Loading>
              <span v-if="commentsNoMore">{{ $t('common.noMore') }}</span>
            </div>
          </template>
        </List>
        <div class="sticky bottom-0 w-full bg-white pb-16">
          <InputWrap
            v-model="commentInput"
            append-icon-btn="sendWhite"
            :focus="!!replyTo"
            @click:append="sendComment"
          ></InputWrap>
        </div>
      </div>
      <Error v-else-if="errMsg" :message="errMsg"></Error>
      <Loading v-else></Loading>
    </template>
  </Page>
</template>

<script setup>
import { ref, watch } from 'vue'
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
  dataExtra: commentsExtra,
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
    feedComments.value = { dataList: comments.value, dataExtra: commentsExtra.value }
    feedError.value = errMsg.value
  }
})
onHydration(() => {
  feed.value = revertFeed(feedFromStore.value)
  revertComments(feedComments.value, { newParams: { article_id: feed.value.id } })
  errMsg.value = feedError.value
})

const commentInput = ref('')
const replyTo = ref(null)
const { isLoading: isSendCommentLoading, execute: execSendComment } = useRequest('Comment.add')
async function sendComment() {
  if (isSendCommentLoading.value) {
    return
  }

  const content = replyTo.value
    ? commentInput.value.substring(getReplyTag(replyTo.value).length)
    : commentInput.value.trim()

  if (!content) {
    return
  }

  const reqData = {
    article_id: feed.value.id,
    content,
  }

  if (replyTo.value) {
    reqData.reply_comment_id = replyTo.value.id
  }

  try {
    await execSendComment(reqData)
    await reloadComments({ newParams: { article_id: feed.value.id } })

    clearInput()

    feed.value.comment += 1
  } catch (e) {
    console.error(e)
  }
}
function onReply(comment) {
  if (replyTo.value) {
    commentInput.value = `${getReplyTag(comment)}${commentInput.value.substring(getReplyTag(replyTo.value).length)}`
    replyTo.value = null
  } else {
    commentInput.value = `${getReplyTag(comment)}${commentInput.value}`
  }
  requestAnimationFrame(() => (replyTo.value = comment))
}
watch(commentInput, (v) => {
  if (replyTo.value) {
    const replyTag = getReplyTag(replyTo.value)
    if (!v.startsWith(replyTag)) {
      commentInput.value = commentInput.value.substring(replyTag.length - 1)
      replyTo.value = null
    }
  }
})
function getReplyTag(comment) {
  return `@${comment.author?.nickname} `
}
function clearInput() {
  commentInput.value = ''
  replyTo.value = null
}
</script>
