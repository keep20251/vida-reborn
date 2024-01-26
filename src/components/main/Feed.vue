<template>
  <div class="flex w-full flex-col space-y-10">
    <!-- head -->
    <div class="flex h-30 w-full items-center">
      <Avatar :radius="30" class="mr-5" :src="defaultAvatar"></Avatar>
      <div class="grow text-base font-bold leading-none">{{ props.item.nickname }}</div>
      <div class="text-gray-57 grow text-right text-sm font-medium leading-5">{{ props.item.postTime }} minutes</div>
      <Icon name="moreVertical" size="20"></Icon>
    </div>

    <!-- media -->
    <div>
      <div class="relative inline-block w-full rounded-md">
        <div class="mt-[60%]"></div>
        <div class="rounded-inherit absolute left-0 top-0 h-full w-full">
          <EncryptImage :src="url" :border-radius="10"></EncryptImage>
        </div>
      </div>
    </div>

    <!-- feature -->
    <div class="flex h-20 space-x-20">
      <div class="flex grow space-x-10">
        <Icon name="likeOutline" size="20"></Icon>
        <div class="text-sm font-medium leading-5">{{ props.item.likes }}</div>
      </div>
      <div class="flex grow space-x-10">
        <Icon name="comment" size="20"></Icon>
        <div class="text-sm font-medium leading-5">{{ props.item.comments }}</div>
      </div>
      <div class="flex grow space-x-10">
        <Icon name="sharePost" size="20"></Icon>
        <div class="text-sm font-medium leading-5">{{ props.item.shares }}</div>
      </div>
      <div class="flex grow space-x-10">
        <Icon name="play" size="20"></Icon>
        <div class="text-sm font-medium leading-5">{{ props.item.views }}</div>
      </div>
      <div class="flex grow space-x-10">
        <Icon name="collection" size="20"></Icon>
        <div class="text-sm font-medium leading-5">{{ props.item.collections }}</div>
      </div>
    </div>

    <!-- content -->
    <div class="flex flex-col space-y-5">
      <div class="text-base font-bold leading-none">{{ props.item.title }}</div>
      <div class="flex items-end space-x-5">
        <div>
          <div class="flex space-x-5">
            <div
              v-for="(tag, index) in props.item.tags"
              :key="`tag-${index}`"
              class="text-base leading-lg text-primary"
            >
              #{{ tag }}
            </div>
          </div>
          <div class="text-base leading-lg">
            {{ props.item.content }}
          </div>
        </div>
        <div class="text-gray-57 text-base leading-lg">more</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Avatar from '@comp/multimedia/Avatar.vue'
import defaultAvatar from '@/assets/images/avatar.jpeg'

const props = defineProps({
  item: {
    type: Object,
    default: () => ({
      nickname: 'Angelababy',
      postTime: '6',
      likes: '113',
      comments: '289',
      shares: '94',
      views: '23,000',
      collections: '94',
      title: 'Hello, New Followers!',
      tags: ['黑丝', '写真'],
      content: 'Thank you so much for joining my Fansly! ❤️ Throw back ❤️ DM me! Hello everyone, this is...',
    }),
  },
})

const url = (function () {
  const v = Math.floor(Math.random() * 3)
  if (v === 0) return 'https://new.xiaoshanzhi1.cn/upload/ads/20240126/2024012618055722099.jpeg'
  if (v === 1) return 'https://new.xiaoshanzhi1.cn/upload/ads/20240126/2024012618055738666.jpeg'
  if (v === 2) return 'https://new.xiaoshanzhi1.cn/upload/ads/20240126/2024012618055836737.png'
})()
</script>
