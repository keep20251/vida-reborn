<template>
  <div class="flex h-[calc(100vh-10rem)] w-full items-center justify-center rounded-lg bg-black">
    <Camera
      ref="camera"
      :autoplay="false"
      :playsinline="true"
      @loading="onLoading"
      @started="onStarted"
      @stopped="onStopped"
      @paused="onPaused"
      @resumed="onResumed"
      @camera-change="onCameraChanged"
      @snapshot="onSnapshot"
      @error="onError"
    >
      <template #default>
        <div class="absolute h-full w-full">
          <div class="absolute top-[calc(50%-2.5rem)] flex w-full flex-col items-center justify-center">
            <div class="rounded-full">
              <Icon size="80" name="focal"></Icon>
            </div>
            <div class="rounded-sm bg-gray-a3 bg-opacity-50 px-10 py-6 text-white">Center your document</div>
          </div>
          <div class="absolute bottom-0 flex w-full items-end justify-between px-30 pb-45">
            <button class="h-20 w-20">
              <Icon v-show="false" size="20" name="questionOutline"></Icon>
            </button>
            <button @click="camera.snapshot()">
              <Icon size="60" name="cameraCapture"></Icon>
            </button>
            <button @click="flipMirror">
              <Icon size="20" name="cameraFlip"></Icon>
            </button>
          </div>
        </div>
      </template>
    </Camera>
  </div>
</template>
<script setup>
import Camera from 'simple-vue-camera'
import { computed, onActivated, onDeactivated, onMounted, onUnmounted, ref } from 'vue'
import { useConfirmData } from '@use/modal/confirm-data'

/**
 * @link(https://github.com/BastiaanJansen/simple-vue-camera#basics)
 */
const camera = ref(null)

const onLoading = () => console.log('camera is loading')
const onStopped = () => console.log('camera is stopped')
const onPaused = () => console.log('camera is paused')
const onResumed = () => console.log('camera is resumed')
const onCameraChanged = () => console.log('camera is changed')
const onError = () => console.log('camera is error')

const emit = defineEmits(['component:confirm'])

const captureData = ref(null)
const onSnapshot = async (data) => {
  emit('component:confirm', data)
  captureData.value = data
}
useConfirmData(() => {
  camera.value.stop()
  return captureData.value
})

const devices = ref([])
const onStarted = async () => {
  devices.value = await camera.value?.devices(['videoinput'])
  console.log('camera', camera.value)
}

const flipMirror = () => {
  if (!camera.value?.video) return
  const isFlipped = camera.value.video.style.transform === 'scaleX(-1)'
  camera.value.video.style.transform = isFlipped ? 'scaleX(1)' : 'scaleX(-1)'
}

onMounted(() => camera.value.start())
onUnmounted(() => camera.value.stop())

onActivated(() => camera.value.start())
onDeactivated(() => camera.value.stop())
</script>
