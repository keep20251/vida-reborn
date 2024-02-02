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

  return {
    get,
    revert,
    sync,
    clear,
  }
})
