<template>
  <Page infinite @load="nextComments" main-top-toggle-disabled scrollNavToggleDisabled>
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
              <span v-if="commentsNoData">{{ $t('common.commentNoData') }}</span>
              <span v-if="commentsNoMore && !commentsNoData">{{ $t('common.noMore') }}</span>
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
            @keypress:enter="sendComment"
          ></InputWrap>
        </div>
      </div>
      <Error v-else-if="errMsg" :message="errMsg"></Error>
      <Loading v-else></Loading>
    </template>
    <template #aside-top>
      <TopSearchBar to-search></TopSearchBar>
    </template>
    <template #aside>
      <ClientOnly>
        <CreatorIntro v-if="feed" :username="feed.user?.username"></CreatorIntro>
        <BulletinCard class="mt-20"></BulletinCard>
        <Carousel class="mt-20" interval-time :label="$t('label.eventAd')"></Carousel>
      </ClientOnly>
    </template>
  </Page>
</template>

<script setup>
import { onActivated, onDeactivated, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { whenever } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { useAccountStore } from '@/store/account'
import { useFeedStore } from '@/store/feed'
import { useHeadStore } from '@/store/head'
import { useHydrationStore } from '@/store/hydration'
import { useNavStore } from '@/store/nav'
import BulletinCard from '@comp/aside/BulletinCard.vue'
import CreatorIntro from '@comp/aside/CreatorIntro.vue'
import Carousel from '@comp/common/Carousel.vue'
import InputWrap from '@comp/form/InputWrap.vue'
import Error from '@comp/info/Error.vue'
import Feed from '@comp/main/Feed.vue'
import Comment from '@comp/message/Comment.vue'
import Head from '@comp/navigation/Head.vue'
import TopSearchBar from '@comp/navigation/TopSearchBar.vue'
import { onHydration, onServerClientOnce } from '@use/lifecycle'
import useRequest from '@use/request'
import { useInfinite } from '@use/request/infinite'
import { commaSplittedToArray } from '@/utils/string-helper'

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
  noData: commentsNoData,
  reload: reloadComments,
  revert: revertComments,
  next: $nextComments,
} = useInfinite('Comment.list', { readonly: false })

const feed = ref(null)
const errMsg = ref(null)
async function loadNewFeed(onCleanup = () => {}) {
  let cleanup = false
  onCleanup(() => (cleanup = true))

  feed.value = null
  errMsg.value = null
  try {
    const id = parseInt(route.params.feedId)

    const feedData = await getFeed(id)
    if (cleanup) {
      return
    }

    // 帖子 username 與 route 參數的 username 不一致必須當成是錯的
    if (feedData.user.username !== route.params.username) {
      errMsg.value = $t('content.feedNotExist')
      return
    }

    feed.value = feedData

    await Promise.allSettled([reloadComments({ newParams: { article_id: feed.value.id } }), loadSeoHead()])
  } catch (e) {
    errMsg.value = e.message
  }
}
function nextComments() {
  if (feed.value === null) {
    return
  }
  $nextComments()
}

// SEO head
const headStore = useHeadStore()
const { setup: setupHead, reset: resetHead } = headStore
async function loadSeoHead() {
  await setupHead({
    title: feed.value.title,
    description: feed.value.content,
    keywords: [feed.value.user?.username, ...commaSplittedToArray(feed.value.tags)],
    url: `/${feed.value.user?.username}/${feed.value.id}`,
    image: feed.value.user?.thumb,
  })
}
onDeactivated(resetHead)

// 進入帖子詳情頁
whenever(
  () => route.name === 'feed',
  (v, _, onCleanup) => {
    if (route.params.feedId !== feed.value?.id) {
      loadNewFeed(onCleanup)
    } else {
      loadSeoHead()
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
  errMsg.value = feedError.value
  if (errMsg.value) {
    return
  }

  feed.value = revertFeed(feedFromStore.value)
  loadSeoHead()
  revertComments(feedComments.value, { newParams: { article_id: feed.value.id } })
})

const commentInput = ref('')
const replyTo = ref(null)
const { isLoading: isSendCommentLoading, execute: execSendComment } = useRequest('Comment.add')
const { isLoading: isCommentLikeLoading, execute: execCommentLike } = useRequest('Comment.like')
const { isLoading: isCommentUnlikeLoading, execute: execCommentUnlike } = useRequest('Comment.unlike')
async function $sendComment() {
  if (isSendCommentLoading.value || isCommentsLoading.value) {
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
async function $onCommentToggleLike(comment) {
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
function $onCommentReply(comment) {
  replyTo.value = comment
}
function clearInput() {
  commentInput.value = ''
  replyTo.value = null
}

const accountStore = useAccountStore()
const { afterLoginAction } = accountStore
const sendComment = afterLoginAction($sendComment)
const onCommentToggleLike = afterLoginAction($onCommentToggleLike)
const onCommentReply = afterLoginAction($onCommentReply)
</script>
