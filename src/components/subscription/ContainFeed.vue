<template>
  <div>
    <div class="flex flex-col space-y-10">
      <div class="flex items-center justify-between">
        <div class="flex flex-row items-center space-x-10">
          <Avatar :radius="12.5" :src="item.user.thumb" />
          <span class="text-base font-bold leading-md">{{ item.user.nickname }}</span>
        </div>
        <span class="text-sm font-normal leading-3 text-gray-57">{{ postTime }}</span>
      </div>
      <div class="flex flex-row space-x-10">
        <div class="relative h-73 w-100">
          <EncryptImage :src="imageUrl" :borderRadius="5" :height="73" :width="100" cover></EncryptImage>
          <div
            v-show="isImage"
            class="absolute bottom-0 right-0 flex flex-row items-center justify-center space-x-5 pb-5 pr-5"
          >
            <Icon name="cameraWhite" size="17"></Icon>
            <span class="text-base font-normal leading-lg text-white">{{ photoLength }}</span>
          </div>
          <div
            v-show="isVideo"
            class="absolute bottom-0 right-0 flex flex-row items-center justify-center space-x-5 pb-5 pr-5"
          >
            <Icon name="videoWhite" size="17"></Icon>
            <span class="text-base font-normal leading-lg text-white">{{ videoTime }}</span>
          </div>
          <div v-show="props.expired" class="absolute bottom-0 right-0 w-full">
            <div class="flex h-27 items-center justify-center rounded-b-xs bg-black">
              <span class="text-white">{{ $t('common.expired') }}</span>
            </div>
          </div>
        </div>
        <div class="flex w-full flex-col justify-between">
          <div class="flex flex-col space-y-5">
            <h3 class="text-base font-bold leading-md text-black">{{ item.title }}</h3>
            <p class="text-sm font-normal leading-3 text-gray-a3">{{ item.content }}</p>
          </div>
          <div class="flex flex-row space-x-10">
            <div class="flex flex-row items-center space-x-10">
              <Icon name="likeOutline" size="20"></Icon>
              <span>{{ item.like }}</span>
            </div>
            <div class="flex flex-row items-center space-x-10">
              <Icon name="comment" size="20"></Icon>
              <span>{{ item.comment }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { toVideoTimeFormat, tsSecondToHumanString } from '@/utils/string-helper'
import { MEDIA_TYPE } from '@/constant/publish'
import Avatar from '../multimedia/Avatar.vue'
import EncryptImage from '../multimedia/EncryptImage.vue'

const props = defineProps({
  item: { type: Object, required: true },
  expired: { type: Boolean, default: false },
})

const { t: $t } = useI18n()

const postTime = computed(() => {
  const v = tsSecondToHumanString(props.item.created_ts, props.item.created_at)
  return typeof v === 'string' ? v : $t(v.key, v.values)
})
const videoTime = computed(() => toVideoTimeFormat(props.item.url[0]?.video_time || 0))

const isVideo = computed(() => props.item.resource_type === MEDIA_TYPE.VIDEO)
const isImage = computed(() => props.item.resource_type === MEDIA_TYPE.IMAGE)

const imageUrl = computed(() => (isImage.value ? props.item.url[0].url : props.item.url[1].url))
const photoLength = computed(() => isImage.value && props.item.url.length)
</script>
