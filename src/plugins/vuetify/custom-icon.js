import { h } from 'vue'

// common button
import back from '@/assets/icons/svg/common/back.svg'
import close from '@/assets/icons/svg/common/close.svg'
import check from '@/assets/icons/svg/common/check.svg'
import checkActive from '@/assets/icons/svg/common/check-active.svg'
import closeActive from '@/assets/icons/svg/common/close-active.svg'
import closeBold from '@/assets/icons/svg/common/close-bold.svg'

// nav button
import home from '@/assets/icons/svg/nav/home.svg'
import search from '@/assets/icons/svg/nav/search.svg'
import publish from '@/assets/icons/svg/nav/publish.svg'
import chat from '@/assets/icons/svg/nav/chat.svg'
import mine from '@/assets/icons/svg/nav/mine.svg'
import homeActive from '@/assets/icons/svg/nav/home-active.svg'
import searchActive from '@/assets/icons/svg/nav/search-active.svg'
import chatActive from '@/assets/icons/svg/nav/chat-active.svg'
import mineActive from '@/assets/icons/svg/nav/mine-active.svg'

// head button
import add from '@/assets/icons/svg/head/add.svg'
import addNoShadow from '@/assets/icons/svg/head/add-no-shadow.svg'
import remove from '@/assets/icons/svg/head/remove.svg'
import more from '@/assets/icons/svg/head/more.svg'
import share from '@/assets/icons/svg/head/share.svg'

// viewer button
import fullscreen from '@/assets/icons/svg/viewer/fullscreen.svg'
import likeBold from '@/assets/icons/svg/viewer/like.svg'
import chatBold from '@/assets/icons/svg/viewer/chat.svg'
import shareBold from '@/assets/icons/svg/viewer/share.svg'
import donateBold from '@/assets/icons/svg/viewer/donate.svg'
import toggler from '@/assets/icons/svg/viewer/toggler.svg'
import up from '@/assets/icons/svg/viewer/arrow-up.svg'
import down from '@/assets/icons/svg/viewer/arrow-down.svg'
import block from '@/assets/icons/svg/viewer/block.svg'
import mute from '@/assets/icons/svg/viewer/mute.svg'
import unmute from '@/assets/icons/svg/viewer/unmute.svg'
import start from '@/assets/icons/svg/viewer/star.svg'

// personal button
import moneyBg from '@/assets/icons/svg/personal/money.svg'
import chatBg from '@/assets/icons/svg/personal/chat.svg'
import follow from '@/assets/icons/svg/personal/follow.svg'
import notify from '@/assets/icons/svg/personal/notify.svg'
import cancelNotify from '@/assets/icons/svg/personal/cancel-notify.svg'

// chat button
import attach from '@/assets/icons/svg/chat/attach.svg'
import send from '@/assets/icons/svg/chat/send.svg'
import money from '@/assets/icons/svg/chat/money.svg'
import heart from '@/assets/icons/svg/chat/heart.svg'
import heartActive from '@/assets/icons/svg/chat/heart-active.svg'

// media button
import video from '@/assets/icons/svg/media/video.svg'
import videoActive from '@/assets/icons/svg/media/video-active.svg'
import photo from '@/assets/icons/svg/media/photo.svg'
import photoActive from '@/assets/icons/svg/media/photo-active.svg'
import eye from '@/assets/icons/svg/media/eye.svg'
import multiPhoto from '@/assets/icons/svg/media/multi-photo.svg'

// mine button
import arrowRight from '@/assets/icons/svg/mine/arrow-right.svg'
import arrowDown from '@/assets/icons/svg/mine/arrow-down.svg'
import arrowLeft from '@/assets/icons/svg/mine/arrow-left.svg'
import user from '@/assets/icons/svg/mine/user.svg'
import login from '@/assets/icons/svg/mine/login.svg'
import wallet from '@/assets/icons/svg/mine/wallet.svg'
import shop from '@/assets/icons/svg/mine/shop.svg'
import shopActive from '@/assets/icons/svg/mine/shop-active.svg'
import play from '@/assets/icons/svg/mine/play.svg'
import document from '@/assets/icons/svg/mine/document.svg'
import setting from '@/assets/icons/svg/mine/setting.svg'
import ask from '@/assets/icons/svg/mine/ask.svg'
import crown from '@/assets/icons/svg/mine/crown.svg'
import filter from '@/assets/icons/svg/mine/filter.svg'
import language from '@/assets/icons/svg/mine/language.svg'
import info from '@/assets/icons/svg/mine/info.svg'
import logout from '@/assets/icons/svg/mine/logout.svg'
import profile from '@/assets/icons/svg/mine/profile.svg'
import password from '@/assets/icons/svg/mine/password.svg'
import user3 from '@/assets/icons/svg/mine/user3.svg'
import union from '@/assets/icons/svg/mine/union.svg'
import deleteAcc from '@/assets/icons/svg/mine/deleteacc.svg'
import lock2 from '@/assets/icons/svg/mine/lock2.svg'
import cookie from '@/assets/icons/svg/mine/cookie.svg'
import sitemap from '@/assets/icons/svg/mine/sitemap.svg'
import yes from '@/assets/icons/svg/mine/yes.svg'
import yesActive from '@/assets/icons/svg/mine/yesActive.svg'
import no from '@/assets/icons/svg/mine/no.svg'
import noActive from '@/assets/icons/svg/mine/no-active.svg'
import show from '@/assets/icons/svg/mine/show.svg'
import hide from '@/assets/icons/svg/mine/hide.svg'
import addActive from '@/assets/icons/svg/mine/add-active.svg'
import reduce from '@/assets/icons/svg/mine/reduce.svg'
import bgMoney from '@/assets/icons/svg/mine/bg-money.svg'
import camera from '@/assets/icons/svg/mine/camera.svg'
import edit from '@/assets/icons/svg/mine/edit.svg'
import version from '@/assets/icons/svg/mine/version.svg'
import arrowDownGray from '@/assets/icons/svg/mine/arrow-down-gray.svg'
import yesSelected from '@/assets/icons/svg/mine/yesSelected.svg'

// publish
import gradientImage from '@/assets/icons/svg/publish/gradient-image.svg'
import trash from '@/assets/icons/svg/publish/trash.svg'
import refresh from '@/assets/icons/svg/publish/refresh.svg'

// social
import instagram from '@/assets/icons/svg/social/instagram.svg'
import twitter from '@/assets/icons/svg/social/twitter.svg'
import tiktok from '@/assets/icons/svg/social/tiktok.svg'
import vida from '@/assets/icons/svg/social/vida.svg'

// form
import calendar from '@/assets/icons/svg/form/calendar.svg'

import cameraFlipOutline from '@/assets/icons/svg/camera/camera-flip-outline.svg'
import cameraFlip from '@/assets/icons/svg/camera/camera-flip.svg'
import flipHorizontal from '@/assets/icons/svg/camera/flip-horizontal.svg'

export const customSvgNameToComponent = {
  // common
  back,
  close,
  check,
  checkActive,
  closeActive,
  closeBold,

  // nav
  home,
  search,
  publish,
  chat,
  mine,
  homeActive,
  searchActive,
  chatActive,
  mineActive,

  // head
  add,
  addNoShadow,
  remove,
  more,
  share,

  // viewer
  fullscreen,
  likeBold,
  chatBold,
  shareBold,
  donateBold,
  toggler,
  up,
  down,
  block,
  mute,
  unmute,
  start,

  // personal
  moneyBg,
  chatBg,
  follow,
  notify,
  cancelNotify,

  // chat
  attach,
  send,
  money,
  heart,
  heartActive,

  // media
  video,
  videoActive,
  photo,
  photoActive,
  eye,
  multiPhoto,

  // mine
  arrowRight,
  arrowDown,
  arrowLeft,
  user,
  login,
  wallet,
  shop,
  shopActive,
  play,
  document,
  setting,
  ask,
  crown,
  filter,
  language,
  info,
  logout,
  profile,
  password,
  user3,
  union,
  deleteAcc,
  lock2,
  cookie,
  sitemap,
  yes,
  yesActive,
  yesSelected,
  no,
  noActive,
  show,
  hide,
  addActive,
  reduce,
  bgMoney,
  camera,
  edit,
  version,
  arrowDownGray,

  // publish
  gradientImage,
  trash,
  refresh,

  // social link
  instagram,
  twitter,
  tiktok,
  vida,

  // form
  calendar,

  // Camera
  cameraFlipOutline,
  cameraFlip,
  flipHorizontal,
}

const customSVG = {
  component: (props) => {
    let style
    if (props.shadow) {
      const filter = 'drop-shadow(0rem 0rem 0.5rem rgba(0, 0, 0, 0.3))'
      style = { filter }
    }
    return h(customSvgNameToComponent[props.icon], { style })
  },
}

export { customSVG }
