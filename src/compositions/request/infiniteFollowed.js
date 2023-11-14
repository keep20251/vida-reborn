import { readonly, ref } from 'vue'
import { useInfinite } from './infinite'
import listenState from './listenState'
import API from '@/http'

export function useInfiniteFollowed(mediaType) {
  const request = API.Media.getFollowedList

  const {
    dataList,
    loading,
    noMore,
    errorMsg,
    init: infiniteInit,
    refresh: infiniteRefresh,
    nextPage: infiniteNextPage,
  } = useInfinite({ request, params: { type: mediaType }, dataArrayKey: 'videoList' })

  const creatorList = ref([])

  function init() {
    infiniteInit(newDataHandler)
  }

  function refresh() {
    infiniteRefresh({ newRequest: request, newParams: { type: mediaType } }, newDataHandler)
  }

  function nextPage() {
    infiniteNextPage()
  }

  function newDataHandler(newData) {
    if (newData.creatorList?.length > 0) {
      creatorList.value.push(...newData.creatorList)
    }
  }

  const observeCancelList = [...listenState(dataList, request)]

  function destroy() {
    observeCancelList.forEach((cancel) => cancel())
    observeCancelList.length = 0
  }

  return {
    dataList,
    creatorList,
    loading: readonly(loading),
    noMore: readonly(noMore),
    errorMsg: readonly(errorMsg),
    init,
    refresh,
    nextPage,
    destroy,
  }
}
