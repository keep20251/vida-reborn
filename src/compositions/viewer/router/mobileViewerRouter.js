/**
 * main viewer
 * {
 *   type: 'main-viewer',
 *   mediaType: MEDIA_TYPE,
 *   index: { video: 0, photo: 0 },
 *   videoFetcher: useInfinite2({ request: API.Media.getRecommendVideoList }),
 *   photoFetcher: useInfinite2({ request: API.Media.getRecommendPhotoList }),
 * }
 * 行為:
 *  1. 上下滑動切換展示項目，滑到倒數第2個觸發繼續更新
 *  2. 點擊大頭貼或往左滑動可以導至 creator(預先載入此頁)
 *  3. 點擊 #tag 可以導至 tag-list
 *
 *
 * tag list
 * {
 *   type: 'tag-list,
 *   tag: `${tag}`,
 *   mediaType: MEDIA_TYPE,
 *   index: { video: 0, photo: 0 },
 *   videoFetcher: useInfiniteWithSorting({ request: API.Media.getVideoList, params: { tag: xxx } }),
 *   photoFetcher: useInfiniteWithSorting({ request: API.Media.getPhotoList, params: { tag: xxx } }),
 * }
 * 行為:
 *  1. 往下滑觸發繼續更新目前的 media tab 清單
 *  2. 點擊任何 media 或往左滑動可以導至 tag-viewer
 *
 *
 * creator
 * {
 *   type: 'creator',
 *   userId: `${userId}`,
 *   mediaType: MEDIA_TYPE,
 *   index: { video: 0, photo: 0, shop: 0 },
 *   videoFetcher: useInfiniteWithSorting({ request: API.Media.getVideoList, params: { aff: id } }),
 *   photoFetcher: useInfiniteWithSorting({ request: API.Media.getPhotoList, params: { aff: id } }),
 *   shopFetcher: useInfiniteWithSorting({ request: API.Media.getShopList, params: { aff: id } }),
 * }
 * 行為:
 *  1. 往下滑觸發繼續更新目前的 media tab 清單
 *  2. 點擊任何 media 或往左滑動可以導至 creator-viewer
 *
 *
 * tag viewer
 * {
 *   type: 'tag-viewer',
 * }
 * 行為:
 *  1. 上下滑動切換展示項目，滑到倒數第2個觸發前頁(tag-list)繼續更新
 *  2. 往左滑或點擊大頭貼可導至 creator(預先載入此頁)
 *  3. 點擊 #tag 可以導至 tag-list
 *
 *
 * creator viewer
 * {
 *   type: 'creator-viewer',
 * }
 * 行為:
 *  1. 上下滑動切換展示項目，滑到倒數第2個通知前頁(creator)觸發繼續更新
 *  2. 點擊大頭貼可以導回上一頁 creator
 *  3. 點擊 #tag 可以導至 tag-list
 *
 *
 * 流程圖如下，後續可無限生長
 *
 *            /--> creator --> creator viewer --> tag-list
 * main viewer
 *            \                            /--> creator --> creator viewer
 *             \--> tag list --> tag viewer
 *                                         \--> tag-list -- tag viewer
 */

import { readonly, ref, computed, watch, toRef, onActivated, onDeactivated } from 'vue'
import { useRafFn } from '@vueuse/core'
import { $t } from '@/i18n'
import { MEDIA_TYPE } from '@/constant/'
import { MAIN_VIEWER, TAG_LIST, CREATOR, TAG_VIEWER, CREATOR_VIEWER, MEDIA_TOGGLE_TYPE } from '@/constant/viewer-router'
import { useInfiniteWithSorting } from '@/compositions/request/infiniteWithSorting'
import { useInfinite2 } from '@/compositions/request/infinite2'
import { useCreatorStore } from '@/store/creator'
import { usePopupMessageStore } from '@/store/popup-message'
import API from '@/http'
import { trackEvent } from '@/gtm'

export function useMobileViewerRouter(viewerName) {
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

  const { open: openMessage } = usePopupMessageStore()
  const { getMedia } = useCreatorStore()

  const stack = ref([])
  const currIndex = ref(0)

  // 某些場景會是整個播放器都在畫面之外的，必須把此改為 false 讓某些行為可以判別停止，例如視頻暫停播放
  const active = ref(true)
  onActivated(() => (active.value = true))
  onDeactivated(() => (active.value = false))

  // 正在從目前頁面返回第一頁
  const isBackingToFirst = ref(false)

  // 正在從目前頁面前往指定索引的 viewer 頁面，供外部用來關閉 transition 效果
  const isToIndexedViewer = ref(false)

  // 媒體切換分成 GENERAL (components/viewer/Head.vue) 和 SWITCHER (components/common/Switcher.vue)
  const mainViewerMediaToggleType = ref(MEDIA_TOGGLE_TYPE.GENERAL)

  // first page active rate
  // 介於 0~1 之間的數值，和 css 的 opacity 一樣，可以說就是要給他用的
  const fpar = ref(1)
  function setFPAR(v) {
    if (currIndex.value > 1) {
      return
    }
    if (v <= 0) {
      fpar.value = 0
    } else if (v >= 1) {
      fpar.value = 1
    } else {
      fpar.value = Number(v.toFixed(2))
    }
  }
  const TRANSITION_DURATION = 300
  let prevTs
  const { resume: transitFPAR, pause } = useRafFn(
    ({ timestamp }) => {
      if (currIndex.value <= 1) {
        const delta = timestamp - (prevTs || timestamp)
        const deltaFpar = Number(parseFloat(delta / TRANSITION_DURATION).toFixed(2))
        fpar.value += currIndex.value === 0 ? deltaFpar : -deltaFpar
        prevTs = timestamp
        if (fpar.value > 1) {
          fpar.value = 1
          stopTransitFPAR()
        } else if (fpar.value < 0) {
          fpar.value = 0
          stopTransitFPAR()
        }
      } else {
        stopTransitFPAR()
      }
    },
    { immediate: false },
  )
  function stopTransitFPAR() {
    pause()
    prevTs = null
  }
  watch(currIndex, (v) => {
    if (v <= 1) {
      transitFPAR()
    }
  })

  const noData = computed(() => {
    try {
      const page = getPage(currIndex.value)
      let targetPage
      if (page.type === MAIN_VIEWER) {
        targetPage = page
      }
      if ([TAG_VIEWER, CREATOR_VIEWER].includes(page.type)) {
        targetPage = getPage(currIndex.value - 1)
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

  // for debug
  // watch(stack, (v) => console.log(viewerName, v), { deep: true })

  let fromWhichPage

  function initFromMainViewer(
    fetcher = {
      videoFetcher: useInfinite2({ request: API.Media.getRecommendVideoList }),
      photoFetcher: useInfinite2({ request: API.Media.getRecommendPhotoList }),
    },
  ) {
    if (currIndex.value !== 0 || stack.value.length !== 0) {
      throw new Error(`Viewer ${viewerName} has been initialized, you cannot init again, please use reset.`)
    }

    fromWhichPage = MAIN_VIEWER
    pushPage(MAIN_VIEWER, {}, fetcher)
    pushPage(CREATOR)
  }

  function initFromCreator(userId) {
    if (currIndex.value !== 0 || stack.value.length !== 0) {
      throw new Error(`Viewer ${viewerName} has been initialized, you cannot init again, please use reset.`)
    }

    fromWhichPage = CREATOR
    pushPage(CREATOR, { userId })
    pushPage(CREATOR_VIEWER)
  }

  function resetFromMainViewer(
    fetcher = {
      videoFetcher: useInfinite2({ request: API.Media.getRecommendVideoList }),
      photoFetcher: useInfinite2({ request: API.Media.getRecommendPhotoList }),
    },
  ) {
    reset(MAIN_VIEWER, {}, fetcher)
  }

  function resetFromCreator(userId) {
    reset(CREATOR, { userId })
  }

  function reset(from, { userId }, mainViewerFetcher) {
    // reviseStack 尚未被執行，將此執行放進 action queue 當中
    if (reviseStackTimeoutId !== null) {
      STACK_REVISING_ACTION_QUEUE.push(() => reset(from, { userId }, mainViewerFetcher))
      return
    }

    fromWhichPage = from

    // 清空
    popPage(0)
    currIndex.value = 0

    switch (from) {
      case MAIN_VIEWER:
        pushPage(MAIN_VIEWER, {}, mainViewerFetcher)
        pushPage(CREATOR)
        break
      case CREATOR:
        pushPage(CREATOR, { userId })
        pushPage(CREATOR_VIEWER)
        break
      default:
        throw new Error('Something went wrong...')
    }
  }

  /**
   * route 往後移動一頁
   * 會伴隨著預判好的下一頁插入
   */
  function next() {
    if (reviseStackTimeoutId !== null) return

    if (currIndex.value >= stack.value.length - 1) return

    currIndex.value += 1

    const currPage = getPage(currIndex.value)

    reviseStack(() => {
      const feed = getTriggerRouteFeed(currIndex.value - 1)

      switch (currPage.type) {
        case CREATOR: {
          pushPage(CREATOR_VIEWER)

          // the 埋
          if (feed) {
            trackEvent({ key: 1, meta: { id: feed.id } })
          }

          break
        }
        case TAG_LIST:
          pushPage(TAG_VIEWER)

          // the 埋
          if (feed) {
            trackEvent({ key: 10, meta: { id: feed.id, tag: currPage.tag } })
          }

          break
        case TAG_VIEWER:
          pushPage(CREATOR)

          // the 埋
          if (feed) {
            if (feed.type === MEDIA_TYPE.VIDEO) {
              trackEvent({ key: 16, meta: { id: feed.id, aff: feed.author.aff } })
            }
            if (feed.type === MEDIA_TYPE.PHOTO) {
              trackEvent({ key: 17, meta: { id: feed.id, aff: feed.author.aff } })
            }
          }

          break
        case CREATOR_VIEWER:
          // the 埋
          if (feed) {
            if (feed.type === MEDIA_TYPE.VIDEO) {
              trackEvent({ key: 16, meta: { id: feed.id, aff: feed.author.aff } })
            }
            if (feed.type === MEDIA_TYPE.PHOTO) {
              trackEvent({ key: 17, meta: { id: feed.id, aff: feed.author.aff } })
            }
          }
          break
      }
    })
  }

  /**
   * route 往前移動一頁
   * 會伴隨著後面不需要的頁面被清除，並添加預判好的下一頁
   */
  function prev() {
    if (reviseStackTimeoutId !== null) return

    if (currIndex.value <= 0) return

    currIndex.value -= 1

    const currPage = getPage(currIndex.value)
    const nextPage = getPage(currIndex.value + 1)

    reviseStack(() => {
      if (CREATOR !== currPage.type) {
        popPage()
      }

      if ([MAIN_VIEWER, TAG_VIEWER].includes(currPage.type) && TAG_LIST === nextPage.type) {
        popPage()
        pushPage(CREATOR)
      }

      if (CREATOR_VIEWER === currPage.type) {
        popPage()
      }
    })
  }

  /**
   * 返回第一頁
   *
   * 這邊採取一次遞減一頁
   * 讓外部可以跑轉場效果
   * 會與 routeComplete 搭配
   * 持續將 currIndex 減至 0
   *
   * 當 currIndex 減至 0 的時候
   * 後續頁面都會被清掉只剩下第一頁和第二頁
   */
  function backToFirst() {
    if (reviseStackTimeoutId !== null) return

    if (currIndex.value === 0) return

    isBackingToFirst.value = true

    currIndex.value -= 1

    if (currIndex.value > 0) {
      reviseStack(() => {})
    } else {
      isBackingToFirst.value = false

      const firstPage = getPage(0)
      const secondPage = getPage(1)

      reviseStack(() => {
        openMessage($t('boundary.start'))

        if (fromWhichPage === MAIN_VIEWER) {
          if (MAIN_VIEWER === firstPage.type) {
            if (CREATOR === secondPage.type) {
              popPage(2)
            }
            if (TAG_LIST === secondPage.type) {
              popPage(1)
              pushPage(CREATOR)
            }
          }
        }

        if (fromWhichPage === CREATOR) {
          if (CREATOR === firstPage.type && CREATOR_VIEWER === secondPage.type) {
            popPage(2)
          }
        }
      })
    }
  }

  /**
   * 當外部曾經呼叫過 prev 或 next 等 route 函式
   * 可以等到轉場效果完成後(@transitionend)執行此函式
   * 通知內部可以進行 revise stack 了
   *
   * 若是在預設時間內沒有任何外部呼叫此函式
   * 那麼就會被直接執行防止 revise stack 沒有發生
   *
   * 最好是由外部轉場效果結束後馬上呼叫
   * 這麼做是最精確的
   */
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

    if (isBackingToFirst.value) {
      backToFirst()
    }
  }

  /**
   * route 往後移動到下一頁 TAG_LIST 頁面
   * 必須是 MAIN_VIEWER, TAG_VIEWER, CREATOR_VIEWER 才能前往
   * 否則拋出錯誤
   *
   * @param {String} tag 下一頁 TAG_LIST 的 tag
   */
  function nextToTagList(tag) {
    if (reviseStackTimeoutId !== null) return

    const currPage = getPage(currIndex.value)

    if ([MAIN_VIEWER, TAG_VIEWER].includes(currPage.type)) {
      // 拿掉 CREATOR PAGE
      popPage()

      pushPage(TAG_LIST, { tag })
    } else if (CREATOR_VIEWER === currPage.type) {
      pushPage(TAG_LIST, { tag })
    } else {
      throw new Error(`${viewerName}: ${currPage.type} page cannot to TAG_LIST page`)
    }

    requestAnimationFrame(next)
  }

  /**
   * route 往後移動到下一頁指定索引的 TAG_VIEWER 或 CREATOR_VIEWER 頁面
   * 必須是 TAG_LIST, CREATOR 才能前往
   * 否則拋出錯誤
   *
   * @param {Number} index 下一頁 VIEWER 要定位的索引
   */
  function nextToIndexedViewer(index) {
    if (reviseStackTimeoutId !== null) return

    const currPage = getPage(currIndex.value)

    if ([TAG_LIST, CREATOR].includes(currPage.type)) {
      switch (currPage.mediaType) {
        case MEDIA_TYPE.VIDEO:
          currPage.index.video = index
          break
        case MEDIA_TYPE.PHOTO:
          currPage.index.photo = index
          break
        case MEDIA_TYPE.SHOP:
          currPage.index.shop = index
          break
      }
    } else {
      throw new Error(`${viewerName}: ${currPage.type} page cannot to VIEWER page`)
    }

    isToIndexedViewer.value = true
    requestAnimationFrame(() => {
      next()
      isToIndexedViewer.value = false
    })
  }

  /**
   * 設定 MAIN_VIEWER 頁面到指定索引
   * 目前頁面必須為 MAIN_VIEWER
   * 否則拋出錯誤
   *
   * @param {Number} index 下一頁 VIEWER 要定位的索引
   */
  function toIndexedMainViewer(index) {
    if (reviseStackTimeoutId !== null) return

    const currPage = getPage(currIndex.value)

    if (MAIN_VIEWER === currPage.type) {
      switch (currPage.mediaType) {
        case MEDIA_TYPE.VIDEO:
          currPage.index.video = index
          break
        case MEDIA_TYPE.PHOTO:
          currPage.index.photo = index
          break
      }
    } else {
      throw new Error(`${viewerName}: ${currPage.type} page is not MAIN_VIEWER, it cannot call toIndexedMainViewer()`)
    }

    isToIndexedViewer.value = true
    requestAnimationFrame(() => (isToIndexedViewer.value = false))
  }

  function getMediaType(index) {
    const page = getPage(index)

    if ([MAIN_VIEWER, TAG_LIST, CREATOR].includes(page.type)) {
      return toRef(page, 'mediaType')
    }

    if ([TAG_VIEWER, CREATOR_VIEWER].includes(page.type)) {
      const prevPage = getPage(index - 1)
      return toRef(prevPage, 'mediaType')
    }

    throw new Error(`${viewerName}: It's imposible to reach here...`)
  }

  function getViewerIndex(index) {
    const page = getPage(index)

    if ([TAG_VIEWER, CREATOR_VIEWER].includes(page.type)) {
      const prevPage = getPage(index - 1)
      return prevPage.index
    }

    if (MAIN_VIEWER === page.type) {
      return page.index
    }

    throw new Error(
      `${viewerName}: Only PAGE.MAIN_VIEWER, PAGE.TAG_VIEWER and PAGE.CREATOR_VIEWER can get viewer index.`,
    )
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

    if ([MAIN_VIEWER, TAG_LIST, CREATOR].includes(page.type)) {
      return page[`${type}Fetcher`]
    }

    if ([TAG_VIEWER, CREATOR_VIEWER].includes(page.type)) {
      const prevPage = getPage(index - 1)
      return prevPage[`${type}Fetcher`]
    }

    throw new Error(`${viewerName}: It's imposible to reach here...`)
  }

  function updateCreator(id) {
    // reviseStack 尚未被執行，將此執行放進 action queue 當中
    if (reviseStackTimeoutId !== null) {
      STACK_REVISING_ACTION_QUEUE.push(() => updateCreator(id))
      return
    }

    try {
      updateCreatorId(currIndex.value, id)
    } catch (e) {
      throw new Error(e.message)
    }
  }

  function updateNextCreator(id) {
    // 正在倒退回第一頁，不需要理會中間頁面的更新
    if (isBackingToFirst.value) return

    // reviseStack 尚未被執行，將此執行放進 action queue 當中
    if (reviseStackTimeoutId !== null) {
      STACK_REVISING_ACTION_QUEUE.push(() => updateNextCreator(id))
      return
    }

    try {
      updateCreatorId(currIndex.value + 1, id)
    } catch (e) {
      throw new Error(e.message)
    }
  }

  function updateCreatorId(index, id) {
    const page = getPage(index)

    if (page.type !== CREATOR) {
      throw new Error(`${viewerName}: Page at index ${index} is not PAGE.CREATOR`)
    }

    if (page.userId === id) {
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

  function pushPage(type, data, mainViewerFetcher) {
    const page = {
      id: idMaker.next().value,
      type,
      ...data,
    }

    if ([MAIN_VIEWER, TAG_LIST].includes(type)) {
      page.index = {
        video: 0,
        photo: 0,
      }

      if (type === MAIN_VIEWER) {
        page.mediaType = MEDIA_TYPE.VIDEO
        page.videoFetcher = mainViewerFetcher.videoFetcher
        page.photoFetcher = mainViewerFetcher.photoFetcher
      }
      if (type === TAG_LIST) {
        let mediaTypeExtendPage = getPage(currIndex.value)
        if ([TAG_VIEWER, CREATOR_VIEWER].includes(mediaTypeExtendPage.type)) {
          mediaTypeExtendPage = getPage(currIndex.value - 1)
        }
        page.mediaType = mediaTypeExtendPage.mediaType
        if (page.mediaType === MEDIA_TYPE.SHOP) {
          page.mediaType = MEDIA_TYPE.VIDEO
        }
        page.videoFetcher = useInfiniteWithSorting({ request: API.Media.getVideoList, params: { tag: page.tag } })
        page.photoFetcher = useInfiniteWithSorting({ request: API.Media.getPhotoList, params: { tag: page.tag } })
      }
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
    if ([MAIN_VIEWER, TAG_LIST].includes(page.type)) {
      page.videoFetcher.destroy && page.videoFetcher.destroy()
      page.photoFetcher.destroy && page.photoFetcher.destroy()
    }
  }

  function getPage(index) {
    const lastIndex = stack.value.length - 1
    if (index > lastIndex) {
      throw new Error(`${viewerName} viewer-router out of index "${index}" for last is "${stack.value.length - 1}"`)
    }
    return stack.value[index]
  }

  function getTriggerRouteFeed(index) {
    if (index > -1) {
      let page = getPage(index)
      if ([TAG_VIEWER, CREATOR_VIEWER].includes(page.type) && index > 0) {
        page = getPage(index - 1)
      }
      switch (page.mediaType) {
        case MEDIA_TYPE.VIDEO:
          return page.videoFetcher.dataList[page.index.video]
        case MEDIA_TYPE.PHOTO:
          return page.photoFetcher.dataList[page.index.photo]
        case MEDIA_TYPE.SHOP:
          return page.shopFetcher.dataList[page.index.shop]
      }
    }
  }

  return {
    pages: readonly(stack),
    currIndex: readonly(currIndex),
    active,
    isBackingToFirst: readonly(isBackingToFirst),
    isToIndexedViewer: readonly(isToIndexedViewer),
    mainViewerMediaToggleType,
    fpar: readonly(fpar),
    noData,

    // configure
    initFromMainViewer,
    initFromCreator,
    resetFromMainViewer,
    resetFromCreator,

    // route
    next,
    prev,
    backToFirst,
    nextToTagList,
    nextToIndexedViewer,
    toIndexedMainViewer,

    // get
    getMediaType,
    getViewerIndex,
    getVideoFetcher,
    getPhotoFetcher,
    getShopFetcher,

    // update
    updateCreator,
    updateNextCreator,
    setFPAR,
    transitFPAR,

    // notify
    routeComplete,
  }
}
