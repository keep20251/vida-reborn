<template>
  <div ref="videoWrap" class="h-full w-full overflow-hidden"></div>
</template>

<script setup>
import { onActivated, onBeforeUnmount, onDeactivated, onMounted, ref } from 'vue'
import lazyloader from '@/utils/lazyloader'
import { add, remove } from '@/utils/video-autoplay-controller'
import { get, release } from '@/utils/video-store'

const props = defineProps({
  id: { type: Number },
  url: { type: String, required: true },
  preview: { type: Boolean, default: false },
})

const emits = defineEmits(['play', 'ended'])

let videoAutoplayController

const videoWrap = ref(null)
const videoElement = ref(null)
const videoCurrentTime = ref(0)
const isLoading = ref(true)
// const isWaiting = ref(false)
const errMsg = ref('')

let autoPlayEnable = true
let videoActionId

function setupVideo() {
  if (videoElement.value !== null) return

  try {
    videoElement.value = get(props.url, {
      currentTime: videoCurrentTime.value,
      onPlay: () => emits('play'),
      onEnded: () => emits('ended'),
      onTimeupdate: () => (videoCurrentTime.value = videoElement.value?.currentTime || 0),
      isPreview: props.preview,
    })
    videoWrap.value.appendChild(videoElement.value)

    videoAutoplayController = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            videoActionId = add({ play: autoPlay, pause: autoPause })
          } else {
            remove(videoActionId)
          }
        })
      },
      {
        threshold: 0.5,
      },
    )
    videoAutoplayController.observe(videoWrap.value)
  } catch (e) {
    console.error(e)
  }
}

function releaseVideo() {
  if (videoElement.value === null) return

  remove(videoActionId)
  if (videoAutoplayController) {
    videoAutoplayController.unobserve(videoWrap.value)
    videoAutoplayController.disconnect()
  }

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

function autoPlay() {
  const video = videoElement.value
  if (!video || !video.paused || !autoPlayEnable) {
    return
  }

  video.play().catch((e) => console.error('video.play() error:', e))
}

function autoPause() {
  const video = videoElement.value
  if (!video || video.paused) {
    autoPlayEnable = false
    return
  }

  autoPlayEnable = true
  videoElement.value.pause()
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
