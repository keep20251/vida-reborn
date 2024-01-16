<template>
  <div class="relative h-[11rem] w-[31.25rem]">
    <img class="h-full w-full rounded-xl bg-no-repeat object-cover" :src="props.bgImage" />
    <div class="absolute top-0 h-full w-full flex-shrink-0 rounded-xl opacity-80" :class="colorTheme"></div>
    <div class="absolute top-0 h-full w-full px-20 py-30">
      <div class="flex flex-row">
        <Avatar :radius="70" class="mr-10" :src="props.avatar" :alt="props.username"></Avatar>
        <div class="flex flex-col gap-y-10">
          <div>
            <div class="text-lg font-bold leading-5 text-white">{{ props.nickname }}</div>
            <div class="text-sm font-normal leading-3 text-white">{{ props.username }}</div>
          </div>
          <div class="w-[14.375rem] text-base font-normal leading-5 text-white">{{ props.content }}</div>
        </div>
        <div class="ml-auto flex items-end">
          <Button class="!px-30">{{ $t('common.viewSubscribePlan') }}</Button>
        </div>
      </div>
      <div class="absolute right-20 top-20 cursor-pointer">
        <Icon name="closeWhite" size="20"></Icon>
      </div>
    </div>
  </div>
</template>
<script setup>
import defaultBgImage from '@/assets/images/creator-card.png'
import defaultAvatar from '@/assets/images/avatar.jpeg'
import Button from '@/components/common/Button.vue'
import { computed } from 'vue'
import Avatar from '@comp/multimedia/Avatar.vue'

const props = defineProps({
  bgImage: {
    type: String,
    default: defaultBgImage,
  },
  avatar: {
    type: String,
    default: defaultAvatar,
  },
  nickname: {
    type: String,
    default: 'Angelababy',
  },
  username: {
    type: String,
    default: '@angelababy',
  },
  content: {
    type: String,
    default: `🇩🇪/🇺🇸 - 19 years😇 check my link to get to know me <3, I'm convinced your massive dick will help me get to the spread, daddy💦💦`,
  },
  theme: {
    type: Number,
    default: 0,
  },
})

const colorTheme = computed(() => {
  switch (props.theme) {
    case 2:
      return 'bg-gradient-to-b from-gray-brown from-[6.82%] to-gray-cyan to-[98.84%]'
    case 1:
      return 'bg-gray-brown'
    case 0:
    default:
      return 'bg-gradient-to-b from-gray-purple from-[6.82%] to-gray-orange to-[98.84%]'
  }
})
</script>
