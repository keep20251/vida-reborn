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

  // 是否正在請求中
  const isLoading = ref(false)

  // 沒有更多了，當判斷到回傳資料數量小於 limit 就會被判定為沒有更多資料
  const noMore = ref(false)

  // 任何請求時捕捉到的錯誤訊息
  const errorMsg = ref('')

  const { data, execute } = useRequest(apiKey)

  async function init() {
    if (!isLoading.value && !noMore.value && dataList.value.length === 0) {
      await nextPage()
    }
  }

  async function refresh({ newParams = params, newLimit = limit } = {}) {
    params = newParams
    limit = newLimit

    isLoading.value = false
    noMore.value = false
    errorMsg.value = ''
    dataList.value = []
    await nextPage()
  }

  async function nextPage() {
    if (isLoading.value) {
      console.warn('Infinite reqeust is loading, but you still call nextPage() to request.')
      return
    }
    if (noMore.value) {
      console.warn('Infinite reqeust is no more data, but you still call nextPage() to request.')
      return
    }

    errorMsg.value = ''
    isLoading.value = true
    const page = Math.ceil(dataList.value.length / limit) + 1

    try {
      await execute({ page, limit, ...params })

      if (data.value.length < limit) {
        noMore.value = true
      }
      dataList.value.push(...data.value)
    } catch (e) {
      console.warn(e)
      errorMsg.value = e.message
    } finally {
      isLoading.value = false
    }
  }

  return {
    dataList,
    isLoading: readonly(isLoading),
    noMore: readonly(noMore),
    errorMsg: readonly(errorMsg),
    init,
    refresh,
    nextPage,
  }
}
