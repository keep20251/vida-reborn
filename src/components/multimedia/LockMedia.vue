<template>
  <div class="relative h-full w-full overflow-hidden rounded-inherit">
    <EncryptImage :src="url" :border-radius="10" cover></EncryptImage>
    <div class="absolute top-0 h-full w-full bg-[rgba(0,0,0,0.5)] backdrop-blur">
      <div class="absolute bottom-20 right-20 flex space-x-5">
        <Icon v-if="icon" :name="icon" size="20"></Icon>
        <span class="text-base text-white">{{ count }}</span>
      </div>
    </div>
    <div class="absolute top-0 flex h-full w-full items-center justify-center">
      <div class="w-3/5">
        <Button>{{ btnText }}</Button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import Button from '@comp/common/Button.vue'
import { FEED_PERM, MEDIA_TYPE } from '@const/publish'

const props = defineProps({
  item: { type: Object, required: true },
})

const isVideo = computed(() => props.item.resource_type === MEDIA_TYPE.VIDEO)
const isImage = computed(() => props.item.resource_type === MEDIA_TYPE.IMAGE)
const url = computed(() => {
  if (isVideo.value) {
    return props.item.url[1]?.url
  }
  if (isImage.value) {
    return props.item.url[0]?.url
  }
  return ''
})
const count = computed(() => {
  if (isVideo.value) {
    return 1
  }
  if (isImage.value) {
    return props.item.url.length
  }
  return ''
})
const btnText = computed(() => {
  if (props.item.article_type === FEED_PERM.SUB) {
    return '訂閱'
  }
  if (props.item.article_type === FEED_PERM.BUY) {
    return '付費'
  }
  return ''
})
const icon = computed(() => (isVideo.value ? 'videoWhite' : isImage.value ? 'cameraWhite' : ''))
</script>
