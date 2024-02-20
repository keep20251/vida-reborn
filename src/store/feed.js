import { reactive } from 'vue'
import { defineStore } from 'pinia'
import useRequest from '@use/request'

export const useFeedStore = defineStore('feed', () => {
  /**
   * {
   *   [id]: {
   *     後端傳來的內容
   *   },
   *   ...
   * }
   */
  const feedsMap = reactive(new Map())

  const inRequesting = {}

  async function get(id) {
    if (feedsMap.has(id)) {
      return feedsMap.get(id)
    }

    if (inRequesting[id]) {
      const { request, promise } = inRequesting[id]
      await promise
      return setupFeed(id, request.data.value)
    }

    const request = useRequest('Article.detail', { params: { id } })
    const promise = request.execute()
    inRequesting[id] = { request, promise }

    try {
      await promise
      return setupFeed(id, request.data.value)
    } finally {
      delete inRequesting[id]
    }
  }

  function setupFeed(id, data) {
    if (!feedsMap.has(id)) {
      feedsMap.set(id, {})
    }

    const feed = feedsMap.get(id)
    Object.assign(feed, data)

    return feed
  }

  /**
   * Hydration 時用來還原後端已經取得過的創作者
   *
   * @param {*} data feed data
   * @return feed in feedsMap
   */
  function revert(data) {
    if (!data) return data

    if (feedsMap.has(data.id)) {
      throw new Error(`Feed '${data.id}' already exist, but you still revert it?`)
    }

    return setupFeed(data.id, data)
  }

  function sync(feedOrFeedList) {
    if (Array.isArray(feedOrFeedList)) {
      return feedOrFeedList.map((feed) => setupFeed(feed.id, feed))
    } else {
      return setupFeed(feedOrFeedList.id, feedOrFeedList)
    }
  }

  function clear() {
    Promise.all(Object.values(inRequesting).map((r) => r.promise)).then(() => {
      feedsMap.clear()
    })
  }

  const { isLoading: isLikeLoading, execute: execLike } = useRequest('Article.like')
  const { isLoading: isUnlikeLoading, execute: execUnlike } = useRequest('Article.unlike')
  async function toggleLike(feed, isLike) {
    if (!feedsMap.has(feed.id)) {
      console.warn(`帖子 ${feed.id} 尚未存在是不能點讚的...`)
      return
    }

    if (isLikeLoading.value || isUnlikeLoading.value) {
      return
    }

    const target = feedsMap.get(feed.id)

    const _isLike = typeof isLike === 'boolean' ? isLike : !target.is_like
    const exec = _isLike ? execLike : execUnlike

    target.is_like = _isLike
    target.like += _isLike ? 1 : target.like > 0 ? -1 : 0
    try {
      await exec({ article_id: target.id })
    } catch (e) {
      console.error('帖子愛心給我出錯傻眼耶搞笑？', e)
    }
  }

  function toggleBlock(aff, isBlock) {
    for (const feed of feedsMap.values()) {
      if (feed.aff === aff) {
        feed.user.is_block = isBlock
      }
    }
  }

  return {
    get,
    revert,
    sync,
    clear,

    toggleLike,
    toggleBlock,
  }
})
