import { readonly, ref } from 'vue'
import useRequest from '.'

/**
 *
 * @param {Function} apiKey api key
 * @param {Object} params 其他額外的參數
 * @param {Number} limit 分頁數量，預設 10
 */
export function useInfinite(apiKey, { params = {}, limit = 10 } = {}) {
  // 請求資料清單
  const dataList = ref([])

  // 沒有更多了，當判斷到回傳資料數量小於 limit 就會被判定為沒有更多資料
  const noMore = ref(false)

  const { data, error, isLoading, execute, cancel } = useRequest(apiKey)

  async function init() {
    if (!isLoading.value && !noMore.value && dataList.value.length === 0) {
      return await next()
    }
    return Promise.reject(new Error('Infinite already init...'))
  }

  function reset({ newParams = params, newLimit = limit } = {}) {
    cancel()
    params = newParams
    limit = newLimit
    dataList.value = []
    noMore.value = false
  }

  async function next() {
    if (isLoading.value) {
      console.warn('Infinite reqeust is loading, but you still call next() to request.')
      return Promise.reject(new Error('Infinite executor is loading...'))
    }
    if (noMore.value) {
      console.warn('Infinite reqeust is no more data, but you still call next() to request.')
      return Promise.reject(new Error('Infinite is no more data...'))
    }

    const page = Math.ceil(dataList.value.length / limit) + 1

    try {
      await execute({ page, limit, ...params })

      if (!Array.isArray(data.value.list)) {
        throw new Error(`API ${apiKey} response data.list is not array...`)
      }

      const newDataList = [...data.value.list]
      if (newDataList.length < limit) {
        noMore.value = true
      }
      dataList.value.push(...newDataList)
      return newDataList
    } catch (e) {
      console.error(e)
      return Promise.reject(e)
    }
  }

  async function reload({ newParams = params, newLimit = limit } = {}) {
    reset({ newParams, newLimit })
    return await init()
  }

  return {
    dataList: readonly(dataList),
    error,
    isLoading,
    noMore: readonly(noMore),
    init,
    reset,
    next,
    reload,
  }
}
