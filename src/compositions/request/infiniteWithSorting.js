import { readonly, ref } from 'vue'
import { useInfinite } from './infinite'
import { useSortingData } from './sorting-data'
import listenState from './listenState'

export function useInfiniteWithSorting({ request, params, limit = 12, toShopColumn = null }) {
  const {
    dataList: unsortDataList,
    loading,
    noMore,
    errorMsg,
    init: infiniteInit,
    refresh: infiniteRefresh,
    nextPage: infiniteNextPage,
  } = useInfinite({ request, params, limit })

  const { getData, refreshData: sortingDataRefresh } = useSortingData()

  const dataList = ref([])

  function init() {
    infiniteInit(newDataListHandler)
  }

  function refresh({ newRequest = request, newParams = params, newLimit = limit } = {}) {
    // console.log('[useInfiniteWithSorting] refresh', { newRequest, newParams, newLimit })
    sortingDataRefresh()
    infiniteRefresh({ newRequest, newParams, newLimit }, newDataListHandler)

    if (observeCancelList.length === 0) {
      observeCancelList.push(...listenState(dataList, newRequest))
    }
  }

  function nextPage() {
    infiniteNextPage(newDataListHandler)
  }

  function newDataListHandler(newDataList) {
    dataList.value = getData(newDataList, toShopColumn)
  }

  const observeCancelList = [...listenState(dataList, request)]

  function destroy() {
    observeCancelList.forEach((cancel) => cancel())
    observeCancelList.length = 0
  }

  return {
    unsortDataList: readonly(unsortDataList),
    dataList: readonly(dataList),
    loading,
    noMore,
    errorMsg,
    init,
    refresh,
    nextPage,
    destroy,
  }
}
