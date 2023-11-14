import { toValue } from 'vue'
import { TYPES, on } from '@/utils/state-broadcast'
import API from '@/http'

const NEED_TO_LISTEN_REQUESTS = [
  // 主頁推薦無限請求
  API.Media.getRecommendVideoList,
  API.Media.getRecommendPhotoList,

  // 指定參數媒體無限請求
  API.Media.getVideoList,
  API.Media.getPhotoList,
  API.Media.getShopList,

  // 主頁追蹤中無限請求
  API.Media.getFollowedList,
]

export default function listenState(dataList, request) {
  const observeCancelList = []

  if (NEED_TO_LISTEN_REQUESTS.includes(request)) {
    observeCancelList.push(
      on(TYPES.LIKE, (id, isLike) => {
        toValue(dataList).forEach((data) => {
          if (data.id === id) {
            data.liked = isLike
            data.like += isLike ? 1 : -1
          }
        })
      }),
    )
    observeCancelList.push(
      on(TYPES.FOLLOW, (aff, isFollow) => {
        toValue(dataList).forEach((data) => {
          if (data.aff === aff) {
            data.author.is_follow = isFollow
          }
        })
      }),
    )
    observeCancelList.push(
      on(TYPES.SUB, (aff, isSubscribe) => {
        toValue(dataList).forEach((data) => {
          if (data.aff === aff) {
            data.need_subscribe = !isSubscribe
            data.can_play = isSubscribe
          }
        })
      }),
    )
    observeCancelList.push(
      on(TYPES.BUY, (id, isBuy) => {
        toValue(dataList).forEach((data) => {
          if (data.id === id) {
            data.need_buy = !isBuy
            data.can_play = isBuy
          }
        })
      }),
    )
    observeCancelList.push(
      on(TYPES.BLOCK, (aff, isBlock) => {
        toValue(dataList).forEach((data) => {
          if (data.aff === aff) {
            data.author.is_block = isBlock
          }
        })
      }),
    )
    observeCancelList.push(
      on(TYPES.OPENING, () => {
        toValue(dataList).forEach((data) => {
          data.need_subscribe = false
          data.can_play = true
        })
      }),
    )
  }

  return observeCancelList
}
