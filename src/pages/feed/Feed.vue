<template>
  <Page infinite @load="nextComments" main-top-toggle-disabled>
    <template #main-top>
      <Head :title="$t('title.post')" @back="clearInput"></Head>
    </template>
    <template #default>
      <div v-if="feed">
        <Feed class="mb-24" :item="feed" disable-to-detail disable-content-fold></Feed>
        <List :items="comments" item-key="id">
          <template #default="{ item }">
            <Comment :item="item" @click:reply="onCommentReply" @click:like="onCommentToggleLike"></Comment>
          </template>
          <template #bottom>
            <div class="flex items-center justify-center py-8 text-gray-a3">
              <Loading v-if="isCommentsLoading"></Loading>
              <span v-if="commentsNoMore">{{ $t('common.noMore') }}</span>
            </div>
          </template>
        </List>
        <div class="sticky bottom-0 w-full bg-white pb-16 pt-8">
          <div v-if="replyTo" class="flex items-center bg-gray-f6 px-20 py-4">
            <div class="grow text-sm text-gray-a3">
              {{ $t('content.replyTo', { name: `@${replyTo.author?.nickname}` }) }}
            </div>
            <div class="cursor-pointer" @click="replyTo = null">
              <Icon name="close" size="12"></Icon>
            </div>
          </div>
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
import { onActivated, onDeactivated, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { whenever } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { useFeedStore } from '@/store/feed'
import { useHydrationStore } from '@/store/hydration'
import { useNavStore } from '@/store/nav'
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

const navStore = useNavStore()
const { show, hide } = navStore
onActivated(hide)
onDeactivated(show)

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
} = useInfinite('Comment.list', { readonly: false })

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
const { isLoading: isCommentLikeLoading, execute: execCommentLike } = useRequest('Comment.like')
const { isLoading: isCommentUnlikeLoading, execute: execCommentUnlike } = useRequest('Comment.unlike')
async function sendComment() {
  if (isSendCommentLoading.value) {
    return
  }

  const content = commentInput.value.trim()

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
async function onCommentToggleLike(comment) {
  if (isCommentLikeLoading.value || isCommentUnlikeLoading.value) {
    return
  }

  const exec = comment.liked ? execCommentUnlike : execCommentLike

  comment.liked = !comment.liked
  comment.like += comment.liked ? 1 : comment.like > 0 ? -1 : 0
  try {
    await exec({ comment_id: comment.id })
  } catch (e) {
    console.error('評論愛心給我出錯傻眼耶搞笑？', e)
  }
}
function onCommentReply(comment) {
  replyTo.value = comment
}
function clearInput() {
  commentInput.value = ''
  replyTo.value = null
}
</script>
