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
const isLoading = ref(true)
// const isWaiting = ref(false)
const errMsg = ref('')

const isPlaying = ref(false)
const autoPlayEnable = ref(true)

let videoActionId

function setupVideo() {
  if (videoElement.value !== null) return

  try {
    videoElement.value = get(props.url, {
      onPlay: () => emits('play'),
      onEnded: () => emits('ended'),
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
  lazyloader.unobserve(videoWrap.value)
}

function autoPlay() {
  const video = videoElement.value
  if (!video || isPlaying.value || !autoPlayEnable.value) {
    return
  }

  video
    .play()
    .then(() => (isPlaying.value = true))
    .catch((e) => {
      console.error('video.play() error:', e)
      isPlaying.value = false
    })
}

function autoPause() {
  const video = videoElement.value
  if (!video || !isPlaying.value) {
    return
  }

  videoElement.value.pause()
  isPlaying.value = false
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
