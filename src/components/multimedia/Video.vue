<template>
  <div
    class="relative h-full w-full overflow-hidden rounded-inherit"
    :style="fullscreenStyle"
    @mousemove="onRootMouseMove"
    @mouseleave="onRootMouseLeave"
    @click.stop="onRootClick"
  >
    <!-- video 嵌入位置 -->
    <div ref="videoWrap" class="absolute top-0 h-full w-full rounded-inherit"></div>

    <!-- 視頻資源載入被卡住的 loading -->
    <div
      v-if="isWaiting"
      class="absolute left-1/2 top-1/2 flex h-50 w-50 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-md bg-black bg-opacity-50"
    >
      <Icon size="40" name="dotLoading" />
    </div>

    <!-- 尚未開始播放前的置中播放按鈕 -->
    <div v-if="!videoElement" class="absolute top-0 h-full w-full cursor-pointer rounded-inherit">
      <EncryptImage :src="posterUrl" :border-radius="10" cover></EncryptImage>
      <div
        class="absolute left-1/2 top-1/2 flex h-50 w-50 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-md bg-black bg-opacity-50"
      >
        <Icon name="playBtn2" size="20"></Icon>
      </div>
      <div class="absolute bottom-20 right-20 flex items-center space-x-5 rounded-inherit drop-shadow">
        <Icon name="videoWhite" size="20"></Icon>
        <span class="text-base text-white">{{ time }}</span>
      </div>
    </div>

    <!-- 播放器 control -->
    <div
      v-else
      class="absolute bottom-0 w-full rounded-inherit rounded-t-none bg-black bg-opacity-50 px-20 pb-20 transition-transform"
      :class="{
        'translate-y-full': !showControl,
      }"
      @click.stop
    >
      <div class="relative w-full cursor-pointer" :class="[videoFullscreen ? 'h-34' : 'h-27']" ref="timeBar">
        <div
          class="absolute top-16 w-full rounded-full"
          :class="[videoFullscreen ? 'h-4' : 'h-2']"
          :style="{
            backgroundImage: `linear-gradient(
                                to right,
                                #7FE2D3 ${videoTimeRate * 100}%,
                                rgba(217,217,217,0.5) ${videoTimeRate * 100}%
                              )`,
          }"
        ></div>
        <div
          class="absolute bg-gray-f6 will-change-transform"
          :class="[videoFullscreen ? 'top-14 h-8 w-4 rounded-[2px]' : 'top-15 h-4 w-2 rounded-[1px]']"
          :style="{ transform: `translateX(${timeBarWidth * videoTimeRate}px)` }"
        ></div>
      </div>
      <div class="flex items-center space-x-10 px-10">
        <Icon
          :name="videoPlay ? 'pauseBtn' : 'playBtn'"
          :size="videoFullscreen ? '24' : '16'"
          class="cursor-pointer"
          @click.stop="togglePlay"
        />
        <div class="grow select-none font-mono text-white" :class="[videoFullscreen ? 'text-md' : 'text-sm']">
          {{ `${toVideoTimeFormat(videoCurrentTime)} / ${toVideoTimeFormat(videoDuration)}` }}
        </div>
        <div class="relative flex items-center">
          <Icon
            :name="videoMuted ? 'mute' : 'volume'"
            :size="videoFullscreen ? '24' : '16'"
            class="cursor-pointer"
            @click.stop="toggleVideoMuted"
            @mouseover="openVolumeControl"
            @mouseleave="closeVolumeControl"
          />
          <div
            v-if="isDesktop && (isVolumeBarDragging || showVolumeControl)"
            class="absolute -left-10 -top-37 flex h-100 w-32 -translate-y-full flex-col items-center justify-between rounded-full bg-black bg-opacity-50 py-10"
          >
            <div class="select-none font-mono text-base text-white">{{ Math.round(videoVolume * 100) }}</div>
            <div
              class="relative h-50 w-full cursor-pointer"
              ref="volumeBar"
              @mouseover="cancelCloseVolumeControl"
              @mouseleave="closeVolumeControl"
            >
              <div class="absolute left-1/2 h-full w-1 -translate-x-1/2 rounded-full bg-white"></div>
              <div
                class="absolute bottom-0 left-1/2 h-full w-2 -translate-x-1/2 rounded-full"
                :style="{
                  backgroundImage: `linear-gradient(
                                     to top,
                                     #7FE2D3 ${videoVolume * 100}%,
                                     rgba(0,0,0,0) ${videoVolume * 100}%
                                   )`,
                }"
              ></div>
              <div
                class="absolute -bottom-3 left-1/2 h-6 w-6 rounded-full bg-contrast will-change-transform"
                :style="{ transform: `translate(-50%, -${volumeBarHeight * videoVolume}px)` }"
              ></div>
            </div>
          </div>
        </div>
        <Icon
          :name="videoFullscreen ? 'fullscreenExit' : 'fullscreen'"
          :size="videoFullscreen ? '24' : '16'"
          class="cursor-pointer"
          @click.stop="toggleFullscreen"
        ></Icon>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onActivated, onBeforeUnmount, onDeactivated, onMounted, ref, watch } from 'vue'
import { useElementSize, useEventListener, useFullscreen } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/store/app'
import { useDrag } from '@use/gesture/drag'
import { useRootScrollLock } from '@use/utils/scroll-lock'
import lazyloader from '@/utils/lazyloader'
import { toVideoTimeFormat } from '@/utils/string-helper'
// import { add, remove } from '@/utils/video-autoplay-controller'
import { get, release } from '@/utils/video-store'

const props = defineProps({
  id: { type: Number },
  url: { type: String, required: true },
  posterUrl: { type: String },
  time: { type: String },
  preview: { type: Boolean, default: false },
  replaySignal: {},
})

const emits = defineEmits(['play', 'ended', 'timeupdate'])

const appStore = useAppStore()
const { isDesktop, videoMuted, videoVolume } = storeToRefs(appStore)
const { toggleVideoMuted, setVideoVolume } = appStore

const videoWrap = ref(null)
const videoElement = ref(null)
const videoCurrentTime = ref(0)
const videoDuration = ref(0)
const videoTimeRate = ref(0)
const videoPlay = ref(false)
const videoFullscreen = ref(false)
const isLoading = ref(true)
const isWaiting = ref(false)
const errMsg = ref('')

const { toggle } = useFullscreen(videoElement)

const timeBar = ref(null)
const { width: timeBarWidth } = useElementSize(timeBar)
const { isDragging: isTimeBarDragging } = useDrag(timeBar, {
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
    if (videoPlay.value) {
      video.play()
    }
  },
})

const volumeBar = ref(null)
const { height: volumeBarHeight } = useElementSize(volumeBar)
const { isDragging: isVolumeBarDragging } = useDrag(volumeBar, {
  isVertical: true,
  onUpdate: setVideoVolume,
})

function togglePlay() {
  const video = videoElement.value
  if (!video) {
    setupVideo()
    requestAnimationFrame(togglePlay)
    return
  }
  if (togglePlay.playPromise) return
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

const fullscreenStyle = computed(() =>
  videoFullscreen.value
    ? {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        borderRadius: 0,
        zIndex: 1000,
      }
    : null,
)
function toggleFullscreen() {
  if (isDesktop.value) {
    videoFullscreen.value = !videoFullscreen.value
  } else {
    toggle()
  }
}
const { lock, unlock } = useRootScrollLock()
watch(videoFullscreen, (v) => (v ? lock() : unlock()))
useEventListener('keydown', (evt) => {
  if (videoFullscreen.value && evt.code === 'Escape') {
    toggleFullscreen()
  }
})

// 音量調整面板開關
const showVolumeControl = ref(false)
function openVolumeControl() {
  showVolumeControl.value = true
}
function closeVolumeControl() {
  cancelCloseVolumeControl()
  closeVolumeControl.timerId = setTimeout(() => (showVolumeControl.value = false), 2000)
}
function cancelCloseVolumeControl() {
  clearTimeout(closeVolumeControl.timerId)
}

// 播放器控制面板開關
const showControl = ref(false)
function openControlThenClose() {
  clearTimeout(openControl.timerId)
  showControl.value = true
  openControl.timerId = setTimeout(closeControl, 2000)
}
function openControl() {
  clearTimeout(openControl.timerId)
  showControl.value = true
}
function closeControl() {
  clearTimeout(openControl.timerId)
  showControl.value = false
  showVolumeControl.value = false
}
watch(videoPlay, (v) => {
  if (v) {
    openControlThenClose()
  } else {
    openControl()
  }
})
watch(isTimeBarDragging, (v) => {
  if (v) {
    openControl()
  } else {
    if (videoPlay.value) {
      openControlThenClose()
    } else {
      openControl()
    }
  }
})
function onRootMouseMove() {
  if (isDesktop.value) {
    if (videoPlay.value) {
      openControlThenClose()
    } else {
      openControl()
    }
  }
}
function onRootMouseLeave() {
  if (isDesktop.value) {
    if (videoPlay.value) {
      closeControl()
    }
  }
}
function onRootClick() {
  if (isDesktop.value) {
    togglePlay()
  } else {
    if (videoElement.value) {
      if (showControl.value) {
        closeControl()
      } else {
        if (videoPlay.value) {
          openControlThenClose()
        } else {
          openControl()
        }
      }
    } else {
      togglePlay()
    }
  }
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
      onEnded: () => {
        emits('ended')
        videoPlay.value = false
        videoFullscreen.value = false
      },
      onTimeupdate: () => {
        videoCurrentTime.value = videoElement.value?.currentTime || 0

        videoTimeRate.value = videoDuration.value === 0 ? 0 : videoCurrentTime.value / videoDuration.value

        emits('timeupdate', videoCurrentTime.value)
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
  // 不自動載入視頻，改成使用者第一次點擊播放才開始載入
  // videoWrap.value.load = setupVideo
  videoWrap.value.unload = releaseVideo
})

onMounted(openLazy)
onBeforeUnmount(closeLazy)
onActivated(openLazy)
onDeactivated(closeLazy)
</script>
