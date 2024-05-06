<template>
  <div class="absolute left-0 top-0 h-full w-full rounded-inherit">
    <EncryptImage v-if="showImage" :src="url" :border-radius="10" cover></EncryptImage>
    <div class="absolute top-0 h-full w-full rounded-inherit bg-[rgba(0,0,0,0.5)] backdrop-blur">
      <div class="absolute bottom-20 right-20 flex space-x-5">
        <Icon v-if="icon" :name="icon" size="20"></Icon>
        <span class="text-base text-white">{{ count }}</span>
      </div>
    </div>
    <div class="absolute top-0 flex h-full w-full flex-col items-center justify-center space-y-18 rounded-inherit">
      <Icon
        v-if="isVideo && item.url[0]?.url !== ''"
        name="replay"
        size="40"
        class="cursor-pointer"
        @click.stop="$emit('replay')"
      ></Icon>
      <div @click.stop>
        <Button @click="clickAction(actionParams)">{{ btnText }}</Button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import Button from '@comp/common/Button.vue'
import { useDialog } from '@use/modal'
import { FEED_PERM, MEDIA_TYPE } from '@const/publish'

const props = defineProps({
  item: { type: Object, required: true },
  showImage: { type: Boolean, default: false },
})

defineEmits(['replay'])

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

const { t: $t } = useI18n()
const btnText = computed(() => {
  if (props.item.article_type === FEED_PERM.SUB) return $t('label.subBtn')
  if (props.item.article_type === FEED_PERM.BUY) return $t('label.buyBtn')
  throw new Error(`未知的帖子類型: ${props.item.article_type}`)
})

const { subscribe, shopBuy } = useDialog()

const clickAction = computed(() => {
  if (props.item.article_type === FEED_PERM.SUB) return subscribe
  if (props.item.article_type === FEED_PERM.BUY) return shopBuy
  throw new Error(`未知的帖子類型: ${props.item.article_type}`)
})

const lowestSub = computed(() => {
  if (props.item?.subscription_list?.length === 0) return null
  return props.item?.subscription_list?.reduce((acc, cur) => (Number(acc.price) < Number(cur.price) ? acc : cur))
})

const actionParams = computed(() => {
  if (props.item.article_type === FEED_PERM.SUB) return { item: lowestSub.value, creator: props.item.user }
  if (props.item.article_type === FEED_PERM.BUY) return props.item
  throw new Error(`未知的帖子類型: ${props.item.article_type}`)
})

const icon = computed(() => (isVideo.value ? 'videoWhite' : isImage.value ? 'cameraWhite' : ''))
</script>
