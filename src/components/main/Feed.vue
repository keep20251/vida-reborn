<template>
  <div class="flex w-full flex-col space-y-10">
    <!-- head -->
    <div class="flex h-30 w-full items-center">
      <Avatar :radius="30" class="mr-5" :src="defaultAvatar"></Avatar>
      <div class="grow text-base font-bold leading-none">{{ item.user.nickname }}</div>
      <div class="grow text-right text-sm font-medium leading-5 text-gray-57">{{ item.created_at }}</div>
      <Icon name="moreVertical" size="20"></Icon>
    </div>

    <!-- media -->
    <div>
      <div class="relative inline-block w-full rounded-md">
        <div class="mt-[60%]"></div>
        <div class="absolute left-0 top-0 h-full w-full rounded-inherit">
          <EncryptImage :src="url" :border-radius="10" cover></EncryptImage>
        </div>
      </div>
    </div>

    <!-- feature -->
    <div class="flex h-20 space-x-20">
      <div class="flex grow space-x-10">
        <Icon name="likeOutline" size="20"></Icon>
        <div class="text-sm font-medium leading-5">{{ item.like }}</div>
      </div>
      <div class="flex grow space-x-10">
        <Icon name="comment" size="20"></Icon>
        <div class="text-sm font-medium leading-5">{{ item.comment }}</div>
      </div>
      <div class="flex grow space-x-10">
        <Icon name="sharePost" size="20"></Icon>
        <div class="text-sm font-medium leading-5">{{ item.share }}</div>
      </div>
      <div class="flex grow space-x-10">
        <Icon name="play" size="20"></Icon>
        <div class="text-sm font-medium leading-5">{{ item.view }}</div>
      </div>
      <div class="flex grow space-x-10">
        <Icon name="collection" size="20"></Icon>
        <div class="text-sm font-medium leading-5">{{ item.package_items.length }}</div>
      </div>
    </div>

    <!-- content -->
    <div class="flex flex-col space-y-5">
      <div class="text-base font-bold leading-none">{{ item.title }}</div>
      <div class="flex items-end space-x-5">
        <div>
          <div class="flex space-x-5">
            <div v-for="(tag, i) in tags" :key="i" class="text-base leading-lg text-primary">#{{ tag }}</div>
          </div>
          <div class="text-base leading-lg">
            {{ item.content }}
          </div>
        </div>
        <div class="text-base leading-lg text-gray-57">more</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import Avatar from '@comp/multimedia/Avatar.vue'
import defaultAvatar from '@/assets/images/avatar.jpeg'

const props = defineProps({
  item: { type: Object },
})

const tags = computed(() => (props.item.tags ? props.item.tags.split(',') : []))

const url = (function () {
  const v = Math.floor(Math.random() * 3)
  if (v === 0) return 'https://new.xiaoshanzhi1.cn/upload/ads/20240126/2024012618055722099.jpeg'
  if (v === 1) return 'https://new.xiaoshanzhi1.cn/upload/ads/20240126/2024012618055738666.jpeg'
  if (v === 2) return 'https://new.xiaoshanzhi1.cn/upload/ads/20240126/2024012618055836737.png'
})()
</script>
