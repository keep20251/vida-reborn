import { readonly, ref } from 'vue'
import listenState from './listenState'

/**
 * 無限請求 last 模式
 * 後端會回傳
 * {
 *   list: [],
 *   last: 11,
 *   hasNext: true
 * }
 *
 * last 就是下一個請求給伺服器取得下一個片段的資料
 *
 * @param {Function} request 請求函式
 */
export function useInfinite2({ request, params, onInit }) {
  // 取得資料的開始索引
  let reset = 1

  // 請求資料清單
  const dataList = ref([])

  // 是否正在請求中
  const loading = ref(false)

  // 沒有更多了，當判斷到回傳資料數量小於 limit 就會被判定為沒有更多資料
  const noMore = ref(false)

  // 任何請求時捕捉到的錯誤訊息
  const errorMsg = ref('')

  function init() {
    if (!loading.value && !noMore.value && dataList.value.length === 0) {
      nextPage(onInit)
    }
  }

  function nextPage(onData) {
    if (loading.value) {
      console.warn('Infinite2 reqeust is loading, but you still call nextPage() to request.')
      return
    }
    if (noMore.value) {
      console.warn('Infinite2 reqeust is no more data, but you still call nextPage() to request.')
      return
    }

    errorMsg.value = ''
    loading.value = true
    request({
      data: {
        reset,
        ...params,
      },
    })
      .then((data) => {
        reset = 0
        dataList.value.push(...data)
        onData && onData(data)
      })
      .catch((e) => {
        console.warn(e)
        errorMsg.value = e.message
      })
      .finally(() => (loading.value = false))
  }

  const observeCancelList = [...listenState(dataList, request)]

  function destroy() {
    observeCancelList.forEach((cancel) => cancel())
    observeCancelList.length = 0
  }

  return {
    dataList: readonly(dataList),
    loading: readonly(loading),
    noMore: readonly(noMore),
    errorMsg: readonly(errorMsg),
    init,
    nextPage,
    destroy,
  }
}
