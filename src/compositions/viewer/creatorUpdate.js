import { computed, watch } from 'vue'
import { MEDIA_TYPE } from '@/constant'

export function useCreatorUpdate(viewerRouter, index) {
  const { getMediaType, getViewerIndex, getVideoFetcher, getPhotoFetcher, getShopFetcher, updateNextCreator } =
    viewerRouter

  const mediaType = getMediaType(index)
  const viewerIndex = getViewerIndex(index)
  const videoFetcher = getVideoFetcher(index)
  const photoFetcher = getPhotoFetcher(index)
  const shopFetcher = getShopFetcher(index)

  const currIndex = computed({
    get() {
      switch (mediaType.value) {
        case MEDIA_TYPE.VIDEO:
          return viewerIndex.video
        case MEDIA_TYPE.PHOTO:
          return viewerIndex.photo
        case MEDIA_TYPE.SHOP:
          return viewerIndex.shop
        default:
          mediaTypeWarn()
          return 0
      }
    },
    set(index) {
      if (index < 0) {
        return
      }
      let fetcher, type
      switch (mediaType.value) {
        case MEDIA_TYPE.VIDEO:
          ;[fetcher, type] = [videoFetcher, 'video']
          break
        case MEDIA_TYPE.PHOTO:
          ;[fetcher, type] = [photoFetcher, 'photo']
          break
        case MEDIA_TYPE.SHOP:
          ;[fetcher, type] = [shopFetcher, 'shop']
          break
        default:
          mediaTypeWarn()
          return
      }
      if (index > fetcher.dataList.length - 1) {
        return
      }
      viewerIndex[type] = index
    },
  })

  const items = computed(() => {
    switch (mediaType.value) {
      case MEDIA_TYPE.VIDEO:
        return videoFetcher.dataList
      case MEDIA_TYPE.PHOTO:
        return photoFetcher.dataList
      case MEDIA_TYPE.SHOP:
        return shopFetcher.dataList
      default:
        mediaTypeWarn()
        return []
    }
  })

  function bindCreatorUpdate(pageActive) {
    function updateCreatorId() {
      if (pageActive.value) {
        updateNextCreator(items.value[currIndex.value]?.author?.aff)
      }
    }
    watch(pageActive, updateCreatorId)
    watch(currIndex, updateCreatorId, { immediate: true })
    watch(mediaType, updateCreatorId)
    watch(items.value, updateCreatorId)
  }

  function mediaTypeWarn() {
    console.warn(`mediaType value is out of boundary, it's only accept VIDEO, PHOTO, and SHOP.`)
  }

  return {
    bindCreatorUpdate,
  }
}
