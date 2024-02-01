import { readonly, ref } from 'vue'
import useRequest from '.'

/**
 *
 * @param {String} apiKey Module.name
 * @param {Object} params 其他額外的參數
 * @param {Number} limit 分頁數量，預設 10
 * @param {Function} transformer 資料轉換函式
 *
 * @returns {Array} infinite.dataList 資料陣列(ref)
 * @returns {Error} infinite.error 請求時發生錯誤
 * @returns {boolean} infinite.isLoading 請求執行中
 * @returns {boolean} infinite.noMore 沒有資料了
 * @returns {Function} infinite.init 第一次發出請求
 * @returns {Function} infinite.reset 重置狀態
 * @returns {Function} infinite.reload 重新載入(reset + init)
 * @returns {Function} infinite.revert 還原資料
 * @returns {Function} infinite.next 後續觸發請求
 */
export function useInfinite(apiKey, { params = {}, limit = 10, transformer } = {}) {
  // 請求資料清單
  const dataList = ref([])

  // 沒有更多了，當判斷到回傳資料數量小於 limit 就會被判定為沒有更多資料
  const noMore = ref(false)

  const { data, error, isLoading, execute, cancel } = useRequest(apiKey)

  async function init() {
    if (!isLoading.value && !noMore.value && dataList.value.length === 0) {
      return await next()
    }
  }

  function reset({ newParams = params, newLimit = limit } = {}) {
    cancel()
    params = newParams
    limit = newLimit
    dataList.value = []
    noMore.value = false
  }

  async function reload({ newParams = params, newLimit = limit } = {}) {
    reset({ newParams, newLimit })
    return await init()
  }

  function revert(src) {
    reset()
    dataList.value.push(...transformData(src))
    if (dataList.value.length % limit !== 0) {
      noMore.value = true
    }
  }

  async function next() {
    if (isLoading.value) {
      // console.warn('Infinite reqeust is loading, but you still call next() to request.')
      return
    }
    if (noMore.value) {
      // console.warn('Infinite reqeust is no more data, but you still call next() to request.')
      return
    }

    const page = Math.ceil(dataList.value.length / limit) + 1

    try {
      await execute({ page, limit, ...params })

      if (!Array.isArray(data.value.list)) {
        throw new Error(`API ${apiKey} response data.list is not array...`)
      }

      const newDataList = transformData(data.value.list)
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

  function transformData(data) {
    return transformer ? transformer(data) : [...data]
  }

  return {
    dataList: readonly(dataList),
    error,
    isLoading,
    noMore: readonly(noMore),
    init,
    reset,
    reload,
    revert,
    next,
  }
}
