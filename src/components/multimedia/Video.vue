<template>
  <div ref="videoWrap" class="h-full w-full overflow-hidden"></div>
</template>

<script setup>
import { onActivated, onDeactivated, onMounted, onUnmounted, ref } from 'vue'
import lazyloader from '@/utils/lazyloader'
import { get, release } from '@/utils/video-store'

const props = defineProps({
  url: { type: String, required: true },
})

const videoWrap = ref(null)
const videoElement = ref(null)
const isLoading = ref(true)
const isWaiting = ref(false)
const errMsg = ref('')

function setupVideo() {
  if (videoElement.value !== null) return

  try {
    videoElement.value = get(props.url)
    videoWrap.value.appendChild(videoElement.value)
  } catch (e) {
    console.error(e)
  }
}

function releaseVideo() {
  if (videoElement.value === null) return

  release(videoElement.value)
  videoElement.value = null
  isLoading.value = true
  errMsg.value = ''
}

function openLazy() {
  videoWrap.value.load = setupVideo
  videoWrap.value.unload = releaseVideo
  lazyloader.observe(videoWrap.value)
}

function closeLazy() {
  releaseVideo()
  lazyloader.unobserve(videoWrap.value)
}

onMounted(openLazy)
onUnmounted(closeLazy)
onActivated(openLazy)
onDeactivated(closeLazy)
</script>
