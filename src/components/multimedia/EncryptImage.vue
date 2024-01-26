<template>
  <div class="flex h-full w-full items-center justify-center" ref="encryptImage" :style="{ ...shapeStyle }">
    <Skeleton v-if="loading"></Skeleton>
    <img
      v-if="decryptedBlob"
      :src="url"
      :alt="alt"
      class="rounded-inherit h-full w-full"
      :class="{ 'object-contain': !cover, 'object-cover': cover }"
    />
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import Skeleton from '@comp/skeleton/index.vue'
import { getDecryptDataBlob } from '@/utils/encrypt-img-store'
import lazyloader from '@/utils/lazyloader'

const props = defineProps({
  src: { type: String },
  failSrc: { type: String },
  alt: { type: String },

  // 圓型
  radius: { type: Number },

  // 非圓形
  width: { type: Number },
  height: { type: Number },
  borderRadius: { type: Number },

  cover: { type: Boolean, default: false },
  clickToFull: { type: Boolean, default: false },

  disableLazy: { type: Boolean, default: false },
})

const emits = defineEmits(['loadeddata', 'error'])

const shapeStyle = computed(() => {
  if (props.radius) {
    const lenVal = `${(props.radius * 2) / 16}rem`
    return {
      width: lenVal,
      height: lenVal,
      borderRadius: lenVal,
    }
  }

  const style = {}
  if (props.width) style.width = `${props.width / 16}rem`
  if (props.height) style.height = `${props.height / 16}rem`
  if (props.borderRadius) style.borderRadius = `${props.borderRadius / 16}rem`
  return style
})

const encryptImage = ref(null)
const loading = ref(false)
const fail = ref(false)
const decryptedBlob = ref(null)
const url = computed(() => {
  if (fail.value) {
    return props.failSrc || ''
  } else {
    return decryptedBlob.value
  }
})

onMounted(() => {
  if (props.disableLazy) {
    loadImage()
  } else {
    encryptImage.value.load = loadImage
    lazyloader.observe(encryptImage.value)
  }
})
onBeforeUnmount(() => {
  lazyloader.unobserve(encryptImage.value)
})
watch(
  () => props.src,
  () => {
    loading.value = false
    fail.value = false
    decryptedBlob.value = null
    loadImage()
  },
)

async function loadImage() {
  if (decryptedBlob.value !== null || loading.value) {
    return
  }

  if (props.src === undefined) {
    loading.value = false
    fail.value = false
    return
  }

  if (props.src === '') {
    loading.value = false
    fail.value = true
    emits('error', new Error('連結為空...'))
    emits('loadeddata')
    return
  }

  loading.value = true
  fail.value = false
  try {
    decryptedBlob.value = await getDecryptDataBlob(props.src)
  } catch (e) {
    console.error('EncryptImage.vue decrypt image error:', e)
    fail.value = true
    emits('error', e)
  } finally {
    loading.value = false
    emits('loadeddata')
  }
}
</script>
