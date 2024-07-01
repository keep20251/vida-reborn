import Hls from 'hls.js'

const VIDEO_LIMIT = 6
const VIDEO_STORE = []
const VIDEO_MUTED_CONTROL_TEMP = [] // 存放與 VIDEO_STORE 初始化完全相同的所有 video 元件，目的是當使用者調整靜音的時候要全部一次改變
const SIGN = `vida_${new Date().getTime()}`
let count = 0

function makeNewVideoElement() {
  count++

  if (count > VIDEO_LIMIT) {
    throw new Error('Video element is reach to maximum limit...')
  }

  const videoElement = document.createElement('video')
  videoElement.style.width = 'inherit'
  videoElement.style.height = 'inherit'
  videoElement.style.background = '#000'
  videoElement.style.objectFit = 'contain'
  videoElement._vida_count = count
  videoElement._vida_sign = SIGN
  videoElement.setAttribute('playsinline', true)
  // 补充安卓playsinline的兼容
  videoElement.setAttribute('webkit-playsinline', true)
  videoElement.setAttribute('x5-playsinline', true)

  // 預設靜音才能自動播放
  videoElement.muted = true

  return videoElement
}

export function init() {
  for (let i = 0; i < VIDEO_LIMIT; i++) {
    const videoElement = makeNewVideoElement()
    VIDEO_STORE.push(videoElement)
    VIDEO_MUTED_CONTROL_TEMP.push(videoElement)
  }
}

export function get(
  src,
  { currentTime = 0, onLoaded, onWaiting, onPlaying, onPlay, onEnded, onTimeupdate, onError, isPreview } = {},
) {
  if (VIDEO_STORE.length === 0) {
    throw new Error('VIDEO_STORE is empty...')
  }

  const videoElement = VIDEO_STORE.shift()

  if (!isPreview) {
    videoElement.setAttribute('loop', true)
  }

  // src 佈置
  if (Hls.isSupported()) {
    const hls = new Hls()
    videoElement._vida_hls = hls
    hls.loadSource(src)
    hls.attachMedia(videoElement)
  } else if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
    videoElement.src = src
  } else {
    throw new Error('Video player is not supported')
  }

  // 參數佈置
  videoElement.onloadeddata = () => (videoElement.currentTime = currentTime)
  videoElement.onprogress = () => {
    onLoaded && onLoaded()
    videoElement.onprogress = undefined
  }
  videoElement.onwaiting = onWaiting
  videoElement.onplaying = onPlaying
  videoElement.onplay = onPlay
  videoElement.onended = onEnded
  videoElement.ontimeupdate = onTimeupdate
  videoElement.onerror = onError

  videoElement.load()

  // console.log(`video ${videoElement._vida_count} 被取用`, VIDEO_STORE.map((v) => v._vida_count).sort())
  return videoElement
}

export function release(videoElement) {
  if (!(videoElement instanceof HTMLVideoElement)) {
    throw new Error('Not video element...')
  }

  if (videoElement._vida_sign !== SIGN) {
    throw new Error('Video element is not belong to store...')
  }

  // 重置 video element
  videoElement.pause()
  videoElement.removeAttribute('src')
  videoElement.removeAttribute('loop')
  videoElement.load()
  videoElement.remove()
  videoElement.onloadeddata = undefined
  videoElement.onprogress = undefined
  videoElement.onwaiting = undefined
  videoElement.onplaying = undefined
  videoElement.onplay = undefined
  videoElement.onended = undefined
  videoElement.ontimeupdate = undefined
  videoElement.onerror = undefined

  // 釋放掉舊的 hls
  if (videoElement._vida_hls) {
    videoElement._vida_hls.destroy()
    delete videoElement._vida_hls
  }

  VIDEO_STORE.push(videoElement)
  // console.log(`video ${videoElement._vida_count} 被釋放`, VIDEO_STORE.map((v) => v._vida_count).sort())
}

export function setMuted(muted) {
  VIDEO_MUTED_CONTROL_TEMP.forEach((videoElement) => (videoElement.muted = muted))
}

export function setVolume(volume) {
  VIDEO_MUTED_CONTROL_TEMP.forEach((videoElement) => (videoElement.volume = volume))
}
