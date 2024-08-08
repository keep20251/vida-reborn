import { ref } from 'vue'
import { useAccountStore } from '@/store/account'
import useRequest from '../request'
import { useInfinite } from '../request/infinite'

export function useComment({ feed }) {
  const commentInput = ref('')
  const replyTo = ref(null)

  const { isLoading: isSendCommentLoading, execute: execSendComment } = useRequest('Comment.add')
  const { isLoading: isCommentLikeLoading, execute: execCommentLike } = useRequest('Comment.like')
  const { isLoading: isCommentUnlikeLoading, execute: execCommentUnlike } = useRequest('Comment.unlike')

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

  function nextComments() {
    if (feed.value === null) {
      return
    }
    $nextComments()
  }

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

  return {
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
    sendComment: afterLoginAction($sendComment),
    onCommentToggleLike: afterLoginAction($onCommentToggleLike),
    onCommentReply: afterLoginAction($onCommentReply),
  }
}
