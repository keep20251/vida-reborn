<template>
  <div class="relative h-full w-full rounded-inherit">
    <EncryptImage :src="url" :border-radius="10" cover></EncryptImage>
    <div class="absolute top-0 h-full w-full rounded-inherit bg-[rgba(0,0,0,0.5)] backdrop-blur">
      <div class="absolute bottom-20 right-20 flex space-x-5">
        <Icon v-if="icon" :name="icon" size="20"></Icon>
        <span class="text-base text-white">{{ count }}</span>
      </div>
    </div>
    <div class="absolute top-0 flex h-full w-full items-center justify-center rounded-inherit">
      <div v-if="item.user.is_block" class="flex flex-col items-center space-y-20">
        <Icon name="block" size="60"></Icon>
        <div class="bg-gray-57 px-20 py-10 font-bold text-white">{{ `已封鎖 ${item.user.nickname}` }}</div>
      </div>
      <div v-else class="w-3/5">
        <Button @click="clickAction(actionParams)">{{ btnText }}</Button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAccountStore } from '@/store/account'
import Button from '@comp/common/Button.vue'
import { useDialog } from '@use/modal'
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

const { t: $t } = useI18n()
const btnText = computed(() => {
  if (props.item.article_type === FEED_PERM.SUB) return $t('common.subscribe')
  if (props.item.article_type === FEED_PERM.BUY) return $t('common.shopBuy')
  throw new Error('未知的帖子類型')
})

const { subscribe, shopBuy } = useDialog()
const { afterLoginAction } = useAccountStore()

const clickAction = computed(() => {
  if (props.item.article_type === FEED_PERM.SUB) return afterLoginAction(subscribe)
  if (props.item.article_type === FEED_PERM.BUY) return afterLoginAction(shopBuy)
  throw new Error('未知的帖子類型')
})

const lowestSub = computed(() =>
  props.item?.subscription_list?.reduce((acc, cur) => (Number(acc.price) < Number(cur.price) ? acc : cur)),
)

const actionParams = computed(() => {
  if (props.item.article_type === FEED_PERM.SUB) return { item: lowestSub.value, creator: props.item.user }
  if (props.item.article_type === FEED_PERM.BUY) return props.item
  throw new Error('未知的帖子類型')
})

const icon = computed(() => (isVideo.value ? 'videoWhite' : isImage.value ? 'cameraWhite' : ''))
</script>
