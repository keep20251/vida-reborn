<template>
  <Page infinite @load="nextComments" main-top-toggle-disabled scroll-nav-toggle-disabled>
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
            <div class="flex items-center justify-center py-8 text-gray-a3" :class="{ 'pb-60': isMobile }">
              <Loading v-if="isCommentsLoading"></Loading>
              <div v-if="commentsNoData" class="text-center">
                <p>{{ $t('common.commentNoData.1') }}</p>
                <p>{{ $t('common.commentNoData.2') }}</p>
              </div>
              <span v-if="commentsNoMore && !commentsNoData">{{ $t('common.noMore') }}</span>
            </div>
          </template>
        </List>
        <div
          class="bottom-0 w-full bg-white pb-16 pt-8"
          :class="{
            'fixed left-0 px-16': isMobile,
            sticky: isDesktop,
          }"
        >
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
import { onActivated, onDeactivated } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { whenever } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/store/app'
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
import { toDateYmd } from '@/utils/string-helper'
import { useFeed } from '@/compositions/feed'

const { isDesktop, isMobile } = storeToRefs(useAppStore())

const { t: $t } = useI18n()
const route = useRoute()

const navStore = useNavStore()
const { show, hide } = navStore
onActivated(hide)
onDeactivated(show)

const {
  feed,
  errMsg,
  revertFeed,
  loadNewFeed,

  commentInput,
  replyTo,
  comments,
  commentsExtra,
  isCommentsLoading,
  commentsNoMore,
  commentsNoData,
  revertComments,
  clearInput,
  nextComments,
  sendComment,
  onCommentToggleLike,
  onCommentReply,
} = useFeed()

// SEO head
const headStore = useHeadStore()
const { setup: setupHead, reset: resetHead } = headStore
async function loadSeoHead() {
  const { title, user, content, tags, created_ts, id, json_info } = feed.value
  await setupHead({
    title: {
      key: 'meta.post.title',
      params: {
        title,
        nickname: user?.nickname,
      },
    },
    description: content,
    author: user?.nickname,
    type: 'article',
    keywords: tags,
    tags,
    publishTime: toDateYmd(new Date(created_ts * 1000)),
    url: `/${user?.username}/${id}`,
    image: user?.thumb,
    jsonld: json_info,
  })
}
onDeactivated(resetHead)

// 進入帖子詳情頁
whenever(
  () => route.name === 'feed',
  (v, _, onCleanup) => {
    if (route.params.feedId !== feed.value?.id) {
      loadNewFeed(route.params, onCleanup, loadSeoHead)
    } else {
      loadSeoHead()
    }
  },
)

// hydration
const hydrationStore = useHydrationStore()
const { feed: feedFromStore, feedComments, feedError } = storeToRefs(hydrationStore)
onServerClientOnce(async (isSSR) => {
  await loadNewFeed(route.params, () => {}, loadSeoHead)

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
</script>
