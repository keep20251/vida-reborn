<template>
  <div class="relative h-full w-full overflow-hidden rounded-inherit" @mousemove="openControl" @click.stop="togglePlay">
    <div ref="videoWrap" class="absolute top-0 h-full w-full rounded-inherit"></div>
    <div
      v-if="isWaiting"
      class="absolute left-1/2 top-1/2 flex h-50 w-50 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-sm bg-white bg-opacity-75"
    >
      <Loading></Loading>
    </div>
    <div
      v-if="videoCurrentTime === 0 && !videoPlay && !isWaiting"
      class="absolute top-0 h-full w-full cursor-pointer rounded-inherit"
    >
      <EncryptImage :src="posterUrl" :border-radius="10" cover></EncryptImage>
      <div
        class="absolute left-1/2 top-1/2 flex h-50 w-50 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-md bg-white bg-opacity-50"
      >
        <Icon name="playBtn" size="20"></Icon>
      </div>
    </div>
    <div
      v-else
      v-show="!videoPlay || isDragging || showControl"
      class="absolute bottom-0 w-full rounded-inherit px-20 pb-20"
      @click.stop
    >
      <div class="relative h-27 w-full cursor-pointer" ref="timeBar">
        <div
          class="absolute top-16 h-2 w-full rounded-full"
          :style="{
            backgroundImage: `linear-gradient(
                                to right,
                                #7FE2D3 ${videoTimeRate * 100}%,
                                rgba(217,217,217,0.5) ${videoTimeRate * 100}%
                              )`,
          }"
        ></div>
        <div
          class="absolute top-15 h-4 w-2 rounded-[1px] bg-gray-f6 will-change-transform"
          :style="{ transform: `translateX(${timeBarWidth * videoTimeRate}px)` }"
        ></div>
      </div>
      <div class="flex items-center space-x-10 px-10">
        <Icon :name="videoPlay ? 'pauseBtn' : 'playBtn'" size="16" class="cursor-pointer" @click.stop="togglePlay" />
        <div class="grow select-none font-mono text-sm text-white">
          {{ `${toVideoTimeFormat(videoCurrentTime)} / ${toVideoTimeFormat(videoDuration)}` }}
        </div>
        <Icon :name="videoMuted ? 'mute' : 'volume'" size="16" class="cursor-pointer" @click.stop="toggleVideoMuted" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { onActivated, onBeforeUnmount, onDeactivated, onMounted, ref, watch } from 'vue'
import { useElementSize } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/store/app'
import { useDrag } from '@use/gesture/drag'
import lazyloader from '@/utils/lazyloader'
import { toVideoTimeFormat } from '@/utils/string-helper'
// import { add, remove } from '@/utils/video-autoplay-controller'
import { get, release } from '@/utils/video-store'

const props = defineProps({
  id: { type: Number },
  url: { type: String, required: true },
  posterUrl: { type: String },
  preview: { type: Boolean, default: false },
  replaySignal: { type: Object },
})

const emits = defineEmits(['play', 'ended', 'timeupdate'])

const appStore = useAppStore()
const { videoMuted } = storeToRefs(appStore)
const { toggleVideoMuted } = appStore

const videoWrap = ref(null)
const videoElement = ref(null)
const videoCurrentTime = ref(0)
const videoDuration = ref(0)
const videoTimeRate = ref(0)
const videoPlay = ref(false)
const isLoading = ref(true)
const isWaiting = ref(false)
const errMsg = ref('')

const timeBar = ref(null)
const { width: timeBarWidth } = useElementSize(timeBar)
const { isDragging } = useDrag(timeBar, {
  onUpdate(newRate) {
    const video = videoElement.value
    if (!video) return
    if (newRate === null) {
      video.currentTime = videoDuration.value * videoTimeRate.value
    } else {
      video.pause()
      videoTimeRate.value = newRate
      video.currentTime = videoDuration.value * newRate
    }
  },
  onEnd() {
    const video = videoElement.value
    if (!video) return
    openControl()
    if (videoPlay.value) {
      video.play()
    }
  },
})

function togglePlay() {
  const video = videoElement.value
  if (!video || togglePlay.playPromise) return
  if (videoPlay.value) {
    video.pause()
    videoPlay.value = false
  } else {
    const promise = video.play()
    if (promise) {
      togglePlay.playPromise = promise
      promise.then(() => (videoPlay.value = true)).finally(() => delete togglePlay.playPromise)
    } else {
      videoPlay.value = true
    }
  }
}
watch(
  () => props.replaySignal,
  () => {
    if (!videoPlay.value) {
      togglePlay()
    }
  },
)

const showControl = ref(false)
function openControl() {
  clearTimeout(openControl.timerId)
  showControl.value = true
  openControl.timerId = setTimeout(() => (showControl.value = false), 2000)
}
// 自動播放相關配置
// let videoAutoplayController
// let autoPlayEnable = true
// let videoActionId
// function autoPlay() {
//   const video = videoElement.value
//   if (!video || !video.paused || !autoPlayEnable) {
//     return
//   }

//   video.play().catch((e) => console.error('video.play() error:', e))
// }
// function autoPause() {
//   const video = videoElement.value
//   if (!video || video.paused) {
//     autoPlayEnable = false
//     return
//   }

//   autoPlayEnable = true
//   videoElement.value.pause()
// }

function setupVideo() {
  if (videoElement.value !== null) return

  try {
    videoElement.value = get(props.url, {
      currentTime: videoCurrentTime.value,
      onWaiting: () => (isWaiting.value = true),
      onPlaying: () => (isWaiting.value = false),
      onPlay: () => emits('play'),
      onEnded: () => emits('ended'),
      onTimeupdate: () => {
        videoCurrentTime.value = videoElement.value?.currentTime || 0

        videoTimeRate.value = videoDuration.value === 0 ? 0 : videoCurrentTime.value / videoDuration.value

        emits('timeupdate', videoCurrentTime.value)

        // 尼瑪 der 視頻會出現播放完畢當下 currentTime 比 duration 還小的情況
        // 某些瀏覽器(safari)可能發生 ended 事件沒觸發到
        // 我尼瑪 der 只好在這邊判斷比 duration 還小兩秒就送 ended 事件
        const { currentTime, duration } = videoElement.value
        if (Math.floor(currentTime) >= Math.floor(duration) - 2) {
          emits('ended')
          const video = videoElement.value
          if (video) {
            video.pause()
            video.currentTime = 0
          }
          videoPlay.value = false
        }
      },
      isPreview: props.preview,
    })
    videoWrap.value.appendChild(videoElement.value)

    // 視頻時長更新回呼
    videoElement.value.ondurationchange = () => (videoDuration.value = videoElement.value?.duration || 0)

    // videoAutoplayController = new IntersectionObserver(
    //   (entries) => {
    //     entries.forEach((entry) => {
    //       if (entry.isIntersecting) {
    //         videoActionId = add({ play: autoPlay, pause: autoPause })
    //       } else {
    //         remove(videoActionId)
    //       }
    //     })
    //   },
    //   {
    //     threshold: 0.5,
    //   },
    // )
    // videoAutoplayController.observe(videoWrap.value)
  } catch (e) {
    console.error(e)
  }
}

function releaseVideo() {
  if (videoElement.value === null) return

  // remove(videoActionId)
  // if (videoAutoplayController) {
  //   videoAutoplayController.unobserve(videoWrap.value)
  //   videoAutoplayController.disconnect()
  // }

  // 清掉客製掛上去的視頻時長更新回呼
  videoElement.value.ondurationchange = undefined

  // 紀錄當前播放到的時間，下次回來直接從此處開始播
  videoCurrentTime.value = videoElement.value.currentTime

  release(videoElement.value)
  videoElement.value = null
  videoPlay.value = false
  isLoading.value = true
  errMsg.value = ''
}

function openLazy() {
  if (!videoWrap.value) return
  lazyloader.observe(videoWrap.value)
}

function closeLazy() {
  releaseVideo()
  if (!videoWrap.value) return
  lazyloader.unobserve(videoWrap.value)
}

onMounted(() => {
  videoWrap.value.load = setupVideo
  videoWrap.value.unload = releaseVideo
})

onMounted(openLazy)
onBeforeUnmount(closeLazy)
onActivated(openLazy)
onDeactivated(closeLazy)
</script>
