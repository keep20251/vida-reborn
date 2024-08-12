<template>
  <BaseDialog v-if="isOpen" size="lg" z-priority="low" no-padding @click:around="closeDialog">
    <template #default>
      <div class="relative w-full pb-20 pl-20 pr-20 pt-40">
        <div class="absolute right-0 top-0 cursor-pointer select-none pr-10 pt-10" @click="closeDialog">
          <Icon name="close" size="20"></Icon>
        </div>
        <div class="scrollbar-md hover-scrollbar relative max-h-[80vh] overflow-auto">
          <div v-if="feed">
            <Feed
              class="mb-24"
              :item="feed"
              disable-to-detail
              disable-content-fold
              @click:creator="close"
              @click:tag="close"
            ></Feed>
            <List :items="comments" item-key="id">
              <template #default="{ item }">
                <Comment :item="item" @click:reply="onCommentReply" @click:like="onCommentToggleLike"></Comment>
              </template>
              <template #bottom>
                <div
                  class="flex items-center justify-center py-8 text-gray-a3"
                  :class="{ 'pb-60': isMobile }"
                  ref="bottomRef"
                >
                  <Loading v-if="isCommentsLoading"></Loading>
                  <div v-if="commentsNoData" class="text-center">
                    <p>{{ $t('common.commentNoData.1') }}</p>
                    <p>{{ $t('common.commentNoData.2') }}</p>
                  </div>
                  <span v-if="commentsNoMore && !commentsNoData">{{ $t('common.noMore') }}</span>
                </div>
              </template>
            </List>
            <div class="sticky bottom-0 w-full bg-white pt-8">
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
          <Loading v-else fit-feed></Loading>
        </div>
      </div>
    </template>
  </BaseDialog>
</template>
<script setup>
import { ref } from 'vue'
import { whenever } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/store/app'
import { useFeedDialogStore } from '@/store/feed-dialog'
import { useFeed } from '@/compositions/feed'
import { useIntersection } from '@/compositions/utils/intersection'
import List from '../common/List.vue'
import Loading from '../common/Loading.vue'
import InputWrap from '../form/InputWrap.vue'
import Error from '../info/Error.vue'
import Feed from '../main/Feed.vue'
import Comment from '../message/Comment.vue'
import BaseDialog from './BaseDialog.vue'

const { isMobile } = storeToRefs(useAppStore())

const {
  feed,
  errMsg,
  loadNewFeed,

  commentInput,
  replyTo,
  comments,
  isCommentsLoading,
  commentsNoMore,
  commentsNoData,
  clearInput,
  nextComments,
  sendComment,
  onCommentToggleLike,
  onCommentReply,
} = useFeed()

const feedDialogStore = useFeedDialogStore()
const { close } = feedDialogStore
const { isOpen, id, username } = storeToRefs(feedDialogStore)

function closeDialog() {
  clearInput()
  close()
}

const bottomRef = ref(null)
useIntersection(bottomRef, {
  onEnter: () => !isCommentsLoading.value && !commentsNoMore.value && nextComments(),
})

whenever(
  id,
  (v, _, onCleanup) => {
    if (v !== feed.value?.id) {
      loadNewFeed({ feedId: id.value, username: username.value }, onCleanup)
    }
  },
  { immediate: true },
)
</script>
