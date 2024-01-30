<template>
  <div class="relative h-[11rem]">
    <div class="h-full w-full rounded-xl bg-no-repeat object-cover">
      <EncryptImage :src="props.item.background" :border-radius="15" cover></EncryptImage>
    </div>
    <div class="absolute top-0 h-full w-full flex-shrink-0 rounded-xl opacity-80" :class="colorTheme"></div>
    <div class="absolute top-0 h-full w-full px-20 py-30">
      <div class="flex flex-row">
        <Avatar :radius="70" class="mr-10" :src="props.item.thumb" :alt="props.item.username"></Avatar>
        <div class="flex flex-col space-y-10">
          <div>
            <div class="text-lg font-bold leading-5 text-white">{{ props.item.nickname }}</div>
            <div class="text-sm font-normal leading-3 text-white">{{ props.item.username }}</div>
          </div>
          <div class="w-[14.375rem] text-base font-normal leading-5 text-white">{{ props.item?.content }}</div>
        </div>
        <div class="ml-auto flex items-end">
          <Button class="!px-10">{{ $t('common.viewSubscribePlan') }}</Button>
        </div>
      </div>
      <div class="absolute right-20 top-20 cursor-pointer">
        <Icon name="closeWhite" size="20"></Icon>
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed } from 'vue'
import Button from '@comp/common/Button.vue'
import Avatar from '@comp/multimedia/Avatar.vue'
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
      content: `🇩🇪/🇺🇸 - 19 years😇 check my link to get to know me <3, I'm convinced your massive dick will help me get to the spread, daddy💦💦`,
    }),
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
      return 'bg-gradient-to-b from-gray-pink from-[0%] to-gray-brown to-[100%]'
    case 0:
    default:
      return 'bg-gradient-to-b from-gray-purple from-[6.82%] to-gray-orange to-[98.84%]'
  }
})
</script>
