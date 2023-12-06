import { defineAsyncComponent } from 'vue'

// function
const add = defineAsyncComponent(() => import('@/assets/icons/function/add.svg'))
const analysis = defineAsyncComponent(() => import('@/assets/icons/function/analysis.svg'))
const attach = defineAsyncComponent(() => import('@/assets/icons/function/attach.svg'))
const back = defineAsyncComponent(() => import('@/assets/icons/function/back.svg'))
const close = defineAsyncComponent(() => import('@/assets/icons/function/close.svg'))
const collection = defineAsyncComponent(() => import('@/assets/icons/function/collection.svg'))
const draft = defineAsyncComponent(() => import('@/assets/icons/function/draft.svg'))
const dropdown = defineAsyncComponent(() => import('@/assets/icons/function/dropdown.svg'))
const emoji = defineAsyncComponent(() => import('@/assets/icons/function/emoji.svg'))
const filter = defineAsyncComponent(() => import('@/assets/icons/function/filter.svg'))
const gif = defineAsyncComponent(() => import('@/assets/icons/function/gif.svg'))
const location = defineAsyncComponent(() => import('@/assets/icons/function/location.svg'))
const moreHorizontal = defineAsyncComponent(() => import('@/assets/icons/function/more-horizontal.svg'))
const moreVertical = defineAsyncComponent(() => import('@/assets/icons/function/more-vertical.svg'))
const picture = defineAsyncComponent(() => import('@/assets/icons/function/picture.svg'))
const play = defineAsyncComponent(() => import('@/assets/icons/function/play.svg'))
const report = defineAsyncComponent(() => import('@/assets/icons/function/report.svg'))
const search = defineAsyncComponent(() => import('@/assets/icons/function/search.svg'))
const send = defineAsyncComponent(() => import('@/assets/icons/function/send.svg'))
const sendWhite = defineAsyncComponent(() => import('@/assets/icons/function/send-white.svg'))
const setting = defineAsyncComponent(() => import('@/assets/icons/function/setting.svg'))
const sharePage = defineAsyncComponent(() => import('@/assets/icons/function/share-page.svg'))
const video = defineAsyncComponent(() => import('@/assets/icons/function/video.svg'))

// interaction
const comment = defineAsyncComponent(() => import('@/assets/icons/interaction/comment.svg'))
const likeOutline = defineAsyncComponent(() => import('@/assets/icons/interaction/like-outline.svg'))
const like = defineAsyncComponent(() => import('@/assets/icons/interaction/like.svg'))
const sharePost = defineAsyncComponent(() => import('@/assets/icons/interaction/share-post.svg'))

// navigation
const explorOutline = defineAsyncComponent(() => import('@/assets/icons/navigation/explore-outline.svg'))
const explore = defineAsyncComponent(() => import('@/assets/icons/navigation/explore.svg'))
const homeOutline = defineAsyncComponent(() => import('@/assets/icons/navigation/home-outline.svg'))
const home = defineAsyncComponent(() => import('@/assets/icons/navigation/home.svg'))
const messageOutline = defineAsyncComponent(() => import('@/assets/icons/navigation/message-outline.svg'))
const message = defineAsyncComponent(() => import('@/assets/icons/navigation/message.svg'))
const starOutline = defineAsyncComponent(() => import('@/assets/icons/navigation/star-outline.svg'))
const star = defineAsyncComponent(() => import('@/assets/icons/navigation/star.svg'))

export const iconSet = {
  // function
  add,
  analysis,
  attach,
  back,
  close,
  collection,
  draft,
  dropdown,
  emoji,
  filter,
  gif,
  location,
  moreHorizontal,
  moreVertical,
  picture,
  play,
  report,
  search,
  send,
  sendWhite,
  setting,
  sharePage,
  video,

  // interaction
  comment,
  likeOutline,
  like,
  sharePost,

  // navigation
  explorOutline,
  explore,
  homeOutline,
  home,
  messageOutline,
  message,
  starOutline,
  star,
}
