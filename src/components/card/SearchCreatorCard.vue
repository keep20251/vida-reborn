<template>
  <div class="relative h-full rounded-md bg-gray-f6">
    <div class="h-full w-full px-20 py-30">
      <div class="flex h-full flex-row items-center">
        <Avatar :radius="70" class="mr-10" :src="props.item?.thumb" :alt="props.item?.username"></Avatar>
        <div class="flex flex-col space-y-10">
          <div class="flex flex-row items-center space-x-5">
            <div class="text-lg font-bold leading-5 text-black">{{ props.item?.nickname }}</div>
            <div class="text-sm font-normal leading-3 text-black">@{{ props.item?.username }}</div>
          </div>
          <div class="text-sm font-normal leading-3 text-black">
            {{ $t('content.posts') }} {{ props.item?.post_num }}
            <span class="text-center"><Icon name="ellipse" size="3"></Icon></span>
            {{ viewCount }} {{ $t('content.view') }}
          </div>
          <div class="text-base font-normal leading-5 text-black">
            {{ props.item?.description }}
          </div>
        </div>
      </div>
    </div>
    <div class="absolute right-20 top-20 cursor-pointer">
      <Icon name="close" size="20"></Icon>
    </div>
  </div>
</template>
<script setup>
import { computed } from 'vue'
import Avatar from '@comp/multimedia/Avatar.vue'
import { toKiloRoundString } from '@/utils/string-helper'
import defaultAvatar from '@/assets/images/avatar.jpeg'
import defaultBgImage from '@/assets/images/creator-card.png'

const props = defineProps({
  item: {
    type: Object,
    default: () => ({
      background: defaultBgImage,
      thumb: defaultAvatar,
      nickname: 'Angelababy',
      username: '@angelababy',
      description: `🇩🇪/🇺🇸 - 19 years😇 check my link to get to know me <3, I'm convinced your massive dick will help me get to the spread, daddy💦💦`,
      post_num: 5,
      videos_count: 5100,
    }),
  },
})

const viewCount = computed(() => toKiloRoundString(props.item?.videos_count ?? 0, 1))
</script>
