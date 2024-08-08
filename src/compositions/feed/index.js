import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useFeedStore } from '@/store/feed'
import { useComment } from './comment'

export function useFeed() {
  const { t: $t } = useI18n()
  const feedStore = useFeedStore()
  const { get: getFeed, revert: revertFeed } = feedStore

  const feed = ref(null)
  const errMsg = ref(null)
  const {
    commentInput,
    replyTo,
    comments,
    commentsExtra,
    isCommentsLoading,
    commentsNoMore,
    commentsNoData,
    reloadComments,
    revertComments,
    clearInput,
    nextComments,
    sendComment,
    onCommentToggleLike,
    onCommentReply,
  } = useComment({ feed })

  async function loadNewFeed({ feedId = null, username = null } = {}, onCleanup = () => {}, onLoad = () => {}) {
    const _feedId = feedId || feed.value?.id
    const _username = username || feed.value?.user.username

    let cleanup = false
    onCleanup(() => (cleanup = true))

    feed.value = null
    errMsg.value = null
    try {
      const id = parseInt(_feedId)

      const feedData = await getFeed(id)

      if (cleanup) {
        return
      }

      // 帖子 username 與 route 參數的 username 不一致必須當成是錯的
      if (feedData.user.username !== _username) {
        errMsg.value = $t('content.feedNotExist')
        return
      }

      feed.value = feedData

      await Promise.allSettled([reloadComments({ newParams: { article_id: feed.value.id } }), onLoad()])
    } catch (e) {
      errMsg.value = e.message
    }
  }

  return {
    feed,
    errMsg,
    getFeed,
    revertFeed,
    loadNewFeed,

    commentInput,
    replyTo,
    comments,
    commentsExtra,
    isCommentsLoading,
    commentsNoMore,
    commentsNoData,
    reloadComments,
    revertComments,
    clearInput,
    nextComments,
    sendComment,
    onCommentToggleLike,
    onCommentReply,
  }
}
