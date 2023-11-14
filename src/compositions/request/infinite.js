import { readonly, ref } from 'vue'
import API from '@/http'
import { FEED_PERMISION } from '@/constant'

/**
 *
 * @param {Function} request 請求函式
 * @param {Object} params 其他額外的參數
 * @param {Number} limit 分頁數量，預設 10
 * @param {String} dataArrayKey 回應資料中的目標陣列位在的 property，預設為回應資料本身
 */
export function useInfinite({ request, params, limit = 10, dataArrayKey }) {
  const controller = new AbortController()

  // 請求資料清單
  const dataList = ref([])

  // 是否正在請求中
  const loading = ref(false)

  // 沒有更多了，當判斷到回傳資料數量小於 limit 就會被判定為沒有更多資料
  const noMore = ref(false)

  // 任何請求時捕捉到的錯誤訊息
  const errorMsg = ref('')

  function init(newDataNotify) {
    if (!loading.value && !noMore.value && dataList.value.length === 0) {
      nextPage(newDataNotify)
    }
  }

  function refresh({ newRequest = request, newParams = params, newLimit = limit } = {}, newDataNotify) {
    if (loading.value) {
      controller.abort()
    }

    request = newRequest
    params = newParams
    limit = newLimit

    loading.value = false
    noMore.value = false
    errorMsg.value = ''
    dataList.value = []
    nextPage(newDataNotify)
  }

  function nextPage(newDataNotify) {
    if (loading.value) {
      console.warn('Infinite reqeust is loading, but you still call nextPage() to request.')
      return
    }
    if (noMore.value) {
      console.warn('Infinite reqeust is no more data, but you still call nextPage() to request.')
      return
    }

    errorMsg.value = ''
    loading.value = true
    const page = Math.ceil(dataList.value.length / limit) + 1

    /**
     * 只要是拿視頻或圖片都把商品給過濾掉，限制要求ALL, SUB類的媒體
     */
    let visibleParams = {}
    if ([API.Media.getVideoList, API.Media.getPhotoList].includes(request)) {
      visibleParams = { visible: `${FEED_PERMISION.ALL},${FEED_PERMISION.SUB}` }
    }
    request(
      {
        data: {
          page,
          limit,
          ...visibleParams,
          ...params,
        },
      },
      {
        signal: controller.signal,
      },
    )
      .then((data) => {
        const arr = dataArrayKey ? data[dataArrayKey] : data

        if (arr.length < limit) {
          noMore.value = true
        }
        dataList.value.push(...arr)

        if (newDataNotify) {
          newDataNotify(data)
        }
      })
      .catch((e) => {
        console.warn(e)
        errorMsg.value = e.message
      })
      .finally(() => (loading.value = false))
  }

  return {
    dataList,
    loading: readonly(loading),
    noMore: readonly(noMore),
    errorMsg: readonly(errorMsg),
    init,
    refresh,
    nextPage,
  }
}
