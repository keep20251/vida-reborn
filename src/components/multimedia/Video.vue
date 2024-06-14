<template>
  <div ref="videoWrap" class="relative h-full w-full overflow-hidden rounded-inherit" @mousemove="openControl">
    <div v-show="!videoPlay || isSwiping || showControl" class="absolute top-0 h-full w-full rounded-inherit">
      <div class="absolute bottom-0 w-full p-20">
        <div
          class="relative h-24 w-full cursor-pointer"
          ref="timeBar"
          @touchstart.stop="onStart"
          @touchmove.stop="onMove"
          @touchend.stop="onEnd"
          @mousedown.stop="onStart"
          @mousemove.stop="onMove"
          @mouseup.stop="onEnd"
        >
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
        <div class="flex items-center space-x-10">
          <Icon :name="videoPlay ? 'pauseBtn' : 'playBtn'" size="12" class="cursor-pointer" @click.stop="togglePlay" />
          <div class="grow select-none text-base text-white">
            {{ `${toVideoTimeFormat(videoCurrentTime)} / ${toVideoTimeFormat(videoDuration)}` }}
          </div>
          <Icon
            :name="videoMuted ? 'mute' : 'volume'"
            size="16"
            class="cursor-pointer"
            @click.stop="toggleVideoMuted"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onActivated, onBeforeUnmount, onDeactivated, onMounted, ref } from 'vue'
import { useElementSize } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/store/app'
import { useTimeBarSwipe } from '@use/gesture/timeBarSwipe'
import lazyloader from '@/utils/lazyloader'
import { toVideoTimeFormat } from '@/utils/string-helper'
// import { add, remove } from '@/utils/video-autoplay-controller'
import { get, release } from '@/utils/video-store'

const props = defineProps({
  id: { type: Number },
  url: { type: String, required: true },
  preview: { type: Boolean, default: false },
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
// const isWaiting = ref(false)
const errMsg = ref('')

const timeBar = ref(null)
const { width: timeBarWidth } = useElementSize(timeBar)
const { isSwiping, onStart, onMove, onEnd } = useTimeBarSwipe(
  timeBar,
  (newRate) => {
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
  () => {
    const video = videoElement.value
    if (!video) return
    if (videoPlay.value) {
      video.play()
    }
  },
)

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

const showControl = ref(false)
function openControl() {
  clearTimeout(openControl.timerId)
  showControl.value = true
  openControl.timerId = setTimeout(() => (showControl.value = false), 3000)
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
        }
      },
      isPreview: props.preview,
    })
    videoWrap.value.prepend(videoElement.value)

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
