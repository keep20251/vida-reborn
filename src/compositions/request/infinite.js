import { computed, readonly, ref, shallowRef } from 'vue'
import useRequest from '.'

/**
 *
 * @param {String} apiKey Module.name
 * @param {Object} params 其他額外的參數
 * @param {Number} limit 分頁數量，預設 10
 * @param {Function} transformer 資料轉換函式
 *
 * @returns {Array} infinite.dataList 資料陣列(ref)
 * @returns {Array} infinite.dataExtra 資料陣列以外的其他資料(shallowRef)
 * @returns {Error} infinite.error 請求時發生錯誤
 * @returns {boolean} infinite.isLoading 請求執行中
 * @returns {boolean} infinite.noMore 沒有資料了
 * @returns {boolean} infinite.noData 已載入完成且沒有任何一筆資料
 * @returns {Function} infinite.init 第一次發出請求
 * @returns {Function} infinite.reset 重置狀態
 * @returns {Function} infinite.reload 重新載入(reset + init)
 * @returns {Function} infinite.revert 還原資料
 * @returns {Function} infinite.next 後續觸發請求
 */
export function useInfinite(apiKey, { params = {}, limit = 10, readonly: ro = true, transformer } = {}) {
  // 請求資料清單
  const dataList = ref([])

  // 清單之外的資料
  const dataExtra = shallowRef(null)

  // 沒有更多了，當判斷到回傳資料數量小於 limit 就會被判定為沒有更多資料
  const noMore = ref(false)

  // 已載入完成且沒有任何一筆資料
  const noData = computed(() => !isLoading.value && noMore.value && dataList.value.length === 0)

  const { data, error, isLoading, execute, cancel } = useRequest(apiKey, { readonly: ro })

  async function init() {
    if (!isLoading.value && !noMore.value && dataList.value.length === 0 && dataExtra.value === null) {
      return await next()
    }
  }

  function reset({ newParams = params, newLimit = limit } = {}) {
    cancel()
    params = newParams
    limit = newLimit
    dataList.value = []
    dataExtra.value = null
    noMore.value = false
  }

  async function reload({ newParams = params, newLimit = limit } = {}) {
    reset({ newParams, newLimit })
    return await init()
  }

  function revert({ dataList: srcDataList, dataExtra: srcDataExtra }, { newParams = params, newLimit = limit } = {}) {
    reset({ newParams, newLimit })

    dataList.value.push(...transformData(srcDataList))

    if (dataList.value.length === 0 || dataList.value.length % limit !== 0) {
      noMore.value = true
    }

    if (srcDataExtra) {
      dataExtra.value = srcDataExtra
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

      const newDataList = transformData(data.value.list)
      if (newDataList.length < limit) {
        noMore.value = true
      }
      dataList.value.push(...newDataList)

      saveExtraData()

      return newDataList
    } catch (e) {
      console.error(e)
      return Promise.reject(e)
    }
  }

  function transformData(data) {
    if (Array.isArray(data)) {
      return transformer ? transformer(data) : [...data]
    }
    console.warn(`${apiKey} data.list is not Array😳😳😳`, data)
    return []
  }

  function saveExtraData() {
    const extraDataKeys = Object.keys(data.value).filter((k) => k !== 'list')
    if (extraDataKeys.length > 0) {
      dataExtra.value = extraDataKeys.reduce((a, v) => {
        a[v] = data.value[v]
        return a
      }, {})
    }
  }

  return {
    dataList: ro ? readonly(dataList) : dataList,
    dataExtra: ro ? readonly(dataExtra) : dataExtra,
    error,
    isLoading,
    noMore: readonly(noMore),
    noData,
    init,
    reset,
    reload,
    revert,
    next,
  }
}
