/**
 * 桌面版只剩下 tag list 和 creator
 *
 * tag list
 * {
 *   type: 'tag-list,
 *   openViewer: false,
 *   tag: `${tag}`,
 *   mediaType: MEDIA_TYPE,
 *   index: { video: 0, photo: 0 },
 *   videoList: [],
 *   photoList: [],
 * }
 * 行為:
 *  1. 往下滑觸發繼續更新目前的 media tab 清單
 *  2. 點擊任何 media 會讓桌面版主播放器切換成此請單
 *
 *
 * creator
 * {
 *   type: 'creator',
 *   openViewer: false,
 *   userId: `${userId}`,
 *   mediaType: MEDIA_TYPE,
 *   index: { video: 0, photo: 0, shop: 0 },
 *   videoList: [],
 *   photoList: [],
 *   shopList: [],
 * }
 * 行為:
 *  1. 往下滑觸發繼續更新目前的 media tab 清單
 *  2. 點擊任何 media 會讓桌面版主播放器切換成此請單
 *
 *
 * 流程圖如下，後續可無限生長
 *
 *   creator -->  tag-list --> creator -->  tag-list
 */

import { ref, readonly, computed, toRef, onActivated } from 'vue'
import { useRoute } from 'vue-router'
import { MEDIA_TYPE } from '@/constant/'
import { MAIN_VIEWER, TAG_LIST, CREATOR, MEDIA_TOGGLE_TYPE } from '@/constant/viewer-router'
import { useInfiniteWithSorting } from '@/compositions/request/infiniteWithSorting'
import { useInfinite2 } from '@/compositions/request/infinite2'
import { useDesktopViewerStore } from '@/store/desktop-viewer'
import { useCreatorStore } from '@/store/creator'
import { useNavStore } from '@/store/nav'
import API from '@/http'
import { trackEvent } from '@/gtm'

export function useDesktopViewerRouter(viewerName) {
  const DEFAULT_REVISE_STACK_MILLISECOND = 400
  const STACK_REVISING_ACTION_QUEUE = []
  let reviseStackTimeoutId = null
  let reviseStackFn = null

  // page id
  const idMaker = (function* () {
    let id = 0
    while (true) {
      yield id++
    }
  })()

  // 播放器點tag的話如果不在自己的nav要把他導回去
  const { toHome, toSearch } = useNavStore()
  const route = useRoute()
  const selfNavName = route.name
  const backToSelfNav = (() => {
    switch (selfNavName) {
      case 'home':
        return toHome
      case 'search':
        return toSearch
      default:
        return () => {
          console.warn('Some thing wrong for backToSelfNav...')
        }
    }
  })()

  const { setViewer: setDekstopViewer } = useDesktopViewerStore()
  const { getMedia } = useCreatorStore()

  const mainViewer = ref({
    mediaType: MEDIA_TYPE.VIDEO,
    index: {
      video: 0,
      photo: 0,
    },
    videoFetcher: null,
    photoFetcher: null,
  })

  const stack = ref([])
  const currIndex = ref(0)

  // 某些場景會是整個播放器都在畫面之外的，必須把此改為 false 讓某些行為可以判別停止，例如視頻暫停播放
  const active = ref(true)

  // 正在從目前頁面返回第一頁
  const isBackingToFirst = ref(false)

  // 正在從目前頁面前往指定索引的 viewer 頁面，供外部用來關閉 transition 效果
  const isToIndexedViewer = ref(false)

  // 媒體切換分成 GENERAL (components/viewer/Head.vue) 和 SWITCHER (components/common/Switcher.vue)
  const mediaToggleType = ref(MEDIA_TOGGLE_TYPE.GENERAL)

  const noData = computed(() => {
    try {
      const page = getPage(currIndex.value)
      let targetPage
      if (page.openViewer) {
        targetPage = page
      } else {
        if (currIndex.value === 0) {
          targetPage = mainViewer.value
        } else {
          targetPage = getPage(currIndex.value - 1)
        }
      }
      if (targetPage) {
        if (targetPage.mediaType === MEDIA_TYPE.VIDEO) {
          return targetPage.videoFetcher.dataList.length === 0
        }
        if (targetPage.mediaType === MEDIA_TYPE.PHOTO) {
          return targetPage.photoFetcher.dataList.length === 0
        }
        if (targetPage.mediaType === MEDIA_TYPE.SHOP) {
          return targetPage.shopFetcher.dataList.length === 0
        }
      }
    } catch (e) {
      return true
    }
    return false
  })

  const isCreatorPage = computed(() => {
    const page = stack.value[currIndex.value]
    const isOpen = page.openViewer
    return CREATOR === page.type && isOpen
  })

  let fromWhichPage

  function setMainViewer(fetcher, mediaType = MEDIA_TYPE.VIDEO) {
    mainViewer.value.mediaType = mediaType
    mainViewer.value.index = {
      video: 0,
      photo: 0,
    }
    mainViewer.value.videoFetcher = fetcher.videoFetcher
    mainViewer.value.photoFetcher = fetcher.photoFetcher

    fetcher.videoFetcher.init()
    fetcher.photoFetcher.init()

    updateDesktopViewer(mainViewer.value)
  }

  function initFromMainViewer(
    fetcher = {
      videoFetcher: useInfinite2({ request: API.Media.getRecommendVideoList }),
      photoFetcher: useInfinite2({ request: API.Media.getRecommendPhotoList }),
    },
    mediaType = MEDIA_TYPE.VIDEO,
  ) {
    if (currIndex.value !== 0 || stack.value.length !== 0) {
      throw new Error(`Viewer ${viewerName} has been initialized, you cannot init again, please use reset.`)
    }

    fromWhichPage = MAIN_VIEWER

    setMainViewer(fetcher, mediaType)
    pushPage(CREATOR)
  }

  function initFromCreator(userId) {
    if (currIndex.value !== 0 || stack.value.length !== 0) {
      throw new Error(`Viewer ${viewerName} has been initialized, you cannot init again, please use reset.`)
    }

    fromWhichPage = CREATOR
    pushPage(CREATOR, { userId })
    getPage(0).openViewer = true
    updateDesktopViewer(getPage(0))
  }

  function resetFromMainViewer(
    fetcher = {
      videoFetcher: useInfinite2({ request: API.Media.getRecommendVideoList }),
      photoFetcher: useInfinite2({ request: API.Media.getRecommendPhotoList }),
    },
    mediaType = MEDIA_TYPE.VIDEO,
  ) {
    reset(MAIN_VIEWER, {}, fetcher, mediaType)
  }

  function resetFromCreator(userId) {
    reset(CREATOR, { userId })
  }

  function reset(from, { userId }, mainViewerFetcher, mainViewerMediaType) {
    // reviseStack 尚未被執行，將此執行放進 action queue 當中
    if (reviseStackTimeoutId !== null) {
      STACK_REVISING_ACTION_QUEUE.push(() => reset(from, { userId }, mainViewerFetcher, mainViewerMediaType))
      return
    }

    fromWhichPage = from

    // 清空
    popPage(0)
    currIndex.value = 0

    switch (from) {
      case MAIN_VIEWER:
        setMainViewer(mainViewerFetcher, mainViewerMediaType)
        pushPage(CREATOR)
        break
      case CREATOR:
        pushPage(CREATOR, { userId })
        getPage(0).openViewer = true
        updateDesktopViewer(getPage(0))
        break
      default:
        throw new Error('Something went wrong...')
    }
  }

  function prev() {
    if (reviseStackTimeoutId !== null) return

    const page = getPage(currIndex.value)

    if (currIndex.value === 0) {
      if (page.openViewer && fromWhichPage === MAIN_VIEWER) {
        page.openViewer = false
        updateDesktopViewer(mainViewer.value)
      }
      return
    }

    page.openViewer = false
    currIndex.value -= 1

    const prevPage = getPage(currIndex.value)
    if (currIndex.value === 0) {
      if (fromWhichPage === MAIN_VIEWER) {
        prevPage.openViewer = false
        updateDesktopViewer(mainViewer.value)
      } else {
        updateDesktopViewer(prevPage)
      }
    } else {
      updateDesktopViewer(prevPage)
    }

    reviseStack(() => {
      popPage()
    })
  }

  function routeComplete() {
    if (reviseStackTimeoutId === null) {
      return
    }

    clearTimeout(reviseStackTimeoutId)
    reviseStackTimeoutId = null

    if (reviseStackFn === null) {
      return
    }

    reviseStackFn()
    reviseStackFn = null

    // reviseStackFn 執行完成後將緩存中的事件執行完
    STACK_REVISING_ACTION_QUEUE.forEach((action) => action())
    STACK_REVISING_ACTION_QUEUE.length = 0

    // if (isBackingToFirst.value) {
    //   backToFirst()
    // }
  }

  function nextToTagList(tag) {
    if (reviseStackTimeoutId !== null) return

    if (selfNavName !== route.name) {
      backToSelfNav()
    }

    const currPage = getPage(currIndex.value)
    if (TAG_LIST === currPage.type) {
      if (currPage.tag !== tag) {
        popPage()
        pushPage(TAG_LIST, { tag })
        const newPage = getPage(currIndex.value)
        requestAnimationFrame(() => {
          newPage.openViewer = true
          updateDesktopViewer(newPage)
        })

        // the 埋
        triggerTrackToTagList(getPage(currIndex.value - 1), tag)
      }
      return
    }

    pushPage(TAG_LIST, { tag })
    requestAnimationFrame(() => (currIndex.value += 1))

    // the 埋
    triggerTrackToTagList(currPage, tag)
  }

  function nextToIndexedViewer(index = 0) {
    if (reviseStackTimeoutId !== null) return

    const page = getPage(currIndex.value)
    page.openViewer = true
    switch (page.mediaType) {
      case MEDIA_TYPE.VIDEO:
        page.index.video = index
        break
      case MEDIA_TYPE.PHOTO:
        page.index.photo = index
        break
      case MEDIA_TYPE.SHOP:
        page.index.shop = index
        break
    }

    if (TAG_LIST === page.type) {
      pushPage(CREATOR)
      requestAnimationFrame(() => {
        currIndex.value += 1
        updateDesktopViewer(page)
      })

      // the 埋
      triggerTrackToViewer(page)
    }

    if (CREATOR === page.type) {
      updateDesktopViewer(page)

      // the 埋
      triggerTrackToViewer(page)
    }
  }

  function toIndexedMainViewer(index) {
    if (reviseStackTimeoutId !== null) return

    if (currIndex.value !== 0 || MAIN_VIEWER !== fromWhichPage) {
      throw Error('Something went wrong...')
    }

    switch (mainViewer.value.mediaType) {
      case MEDIA_TYPE.VIDEO:
        mainViewer.value.index.video = index
        break
      case MEDIA_TYPE.PHOTO:
        mainViewer.value.index.photo = index
        break
    }
  }

  function getMediaType(index) {
    const page = getPage(index)

    if ([TAG_LIST, CREATOR].includes(page.type)) {
      return toRef(page, 'mediaType')
    }

    throw new Error(`It's imposible to reach here...`)
  }

  function getViewerIndex(index) {
    const page = getPage(index)

    if ([TAG_LIST, CREATOR].includes(page.type)) {
      return page.index
    }

    throw new Error(`Only PAGE.MAIN_VIEWER, PAGE.TAG_VIEWER and PAGE.CREATOR_VIEWER can get viewer index.`)
  }

  function getVideoFetcher(index) {
    return getMediaFetcher(index, 'video')
  }

  function getPhotoFetcher(index) {
    return getMediaFetcher(index, 'photo')
  }

  function getShopFetcher(index) {
    return getMediaFetcher(index, 'shop')
  }

  function getMediaFetcher(index, type) {
    const page = getPage(index)

    if ([TAG_LIST, CREATOR].includes(page.type)) {
      return page[`${type}Fetcher`]
    }

    throw new Error(`It's imposible to reach here...`)
  }

  function updateCreator(id) {
    // reviseStack 尚未被執行，將此執行放進 action queue 當中
    if (reviseStackTimeoutId !== null) {
      STACK_REVISING_ACTION_QUEUE.push(() => updateCreator(id))
      return
    }

    const page = getPage(currIndex.value)

    if (page.type !== CREATOR || page.userId === id) {
      return
    }

    page.userId = id

    const media = getMedia(id)
    page.index.video = 0
    page.index.photo = 0
    page.index.shop = 0
    page.videoFetcher = media.video
    page.photoFetcher = media.photo
    page.shopFetcher = media.shop
  }

  function reviseStack(fn) {
    reviseStackFn = fn

    // 預設時間內沒被執行就直接執行
    reviseStackTimeoutId = setTimeout(routeComplete, DEFAULT_REVISE_STACK_MILLISECOND)
  }

  function pushPage(type, data) {
    const page = {
      id: idMaker.next().value,
      type,
      openViewer: false,
      ...data,
    }

    if (TAG_LIST === type) {
      page.mediaType = MEDIA_TYPE.VIDEO
      page.index = {
        video: 0,
        photo: 0,
      }
      page.videoFetcher = useInfiniteWithSorting({ request: API.Media.getVideoList, params: { tag: page.tag } })
      page.photoFetcher = useInfiniteWithSorting({ request: API.Media.getPhotoList, params: { tag: page.tag } })
    }

    if (CREATOR === type) {
      page.mediaType = MEDIA_TYPE.VIDEO
      page.index = {
        video: 0,
        photo: 0,
        shop: 0,
      }
      if (page.userId) {
        const media = getMedia(page.userId)
        page.videoFetcher = media.video
        page.photoFetcher = media.photo
        page.shopFetcher = media.shop
      }
    }

    stack.value.push(page)
  }

  function popPage(restCount) {
    // pop 至剩餘頁數
    if (typeof restCount === 'number') {
      if (stack.value.length > restCount) {
        const pages = stack.value.splice(restCount)
        pages.forEach((page) => destroyPageFetcher(page))
      }
    }

    // pop 最後一頁
    else {
      if (stack.value.length > 0) {
        const page = stack.value.pop()
        destroyPageFetcher(page)
      }
    }
  }

  function destroyPageFetcher(page) {
    if (TAG_LIST === page.type) {
      page.videoFetcher.destroy()
      page.photoFetcher.destroy()
    }
  }

  function getPage(index) {
    const lastIndex = stack.value.length - 1
    if (index > lastIndex) {
      throw new Error(`viewer-router out of index "${index}" for last is "${stack.value.length - 1}"`)
    }
    return stack.value[index]
  }

  function updateDesktopViewer(page) {
    setDekstopViewer({
      mediaType: toRef(page, 'mediaType'),
      videoIndex: toRef(page.index, 'video'),
      photoIndex: toRef(page.index, 'photo'),
      shopIndex: CREATOR === page.type ? toRef(page.index, 'shop') : null,
      videoFetcher: page.videoFetcher,
      photoFetcher: page.photoFetcher,
      shopFetcher: CREATOR === page.type ? page.shopFetcher : null,
    })
  }

  function triggerTrackToTagList(page, tag) {
    if (page.mediaType === MEDIA_TYPE.VIDEO) {
      const feed = page.videoFetcher.dataList[page.index.video]
      trackEvent({ key: 10, meta: { id: feed.id, tag } })
    }
    if (page.mediaType === MEDIA_TYPE.PHOTO) {
      const feed = page.photoFetcher.dataList[page.index.photo]
      trackEvent({ key: 10, meta: { id: feed.id, tag } })
    }
  }

  function triggerTrackToViewer(page) {
    if (page.mediaType === MEDIA_TYPE.VIDEO) {
      const feed = page.videoFetcher.dataList[page.index.video]
      trackEvent({ key: 16, meta: { id: feed.id, aff: feed.author.aff } })
    }
    if (page.mediaType === MEDIA_TYPE.PHOTO) {
      const feed = page.photoFetcher.dataList[page.index.photo]
      trackEvent({ key: 17, meta: { id: feed.id, aff: feed.author.aff } })
    }
  }

  // 通知 DesktopViewer 換回來
  onActivated(() => {
    let prevPage = mainViewer.value
    for (let i = 0; i < stack.value.length; i++) {
      const page = stack.value[i]
      if (page.openViewer) {
        prevPage = page
      } else {
        break
      }
    }
    updateDesktopViewer(prevPage)
  })

  return {
    pages: readonly(stack),
    currIndex: readonly(currIndex),
    active,
    isBackingToFirst: readonly(isBackingToFirst),
    isToIndexedViewer: readonly(isToIndexedViewer),
    mediaToggleType,
    noData,

    // 桌面版 tag 是否要顯示 shop 判斷用
    isCreatorPage,

    initFromMainViewer,
    initFromCreator,
    resetFromMainViewer,
    resetFromCreator,

    // route
    prev,
    nextToTagList,
    nextToIndexedViewer,
    toIndexedMainViewer,

    // get
    getMediaType,
    getViewerIndex,
    getVideoFetcher,
    getPhotoFetcher,
    getShopFetcher,

    updateCreator,

    routeComplete,
  }
}
