<template>
  <Link
    class="cursor-pointer"
    :href="`/${props.item?.username}`"
    :title="props.item?.nickname"
    @click="toCreator(props.item?.username)"
  >
    <div class="relative h-full select-none rounded-md bg-gray-f6">
      <div class="h-full w-full px-20 py-30">
        <div class="flex h-full flex-row items-center">
          <Avatar :radius="35" class="mr-10" :src="props.item?.thumb" :alt="props.item?.username"></Avatar>
          <div class="flex flex-col space-y-10">
            <div class="flex cursor-pointer flex-row items-center space-x-5">
              <div class="text-lg font-bold leading-5 text-black">{{ props.item?.nickname }}</div>
              <div class="text-sm font-normal leading-3 text-black">@{{ props.item?.username }}</div>
            </div>
            <div class="flex text-sm font-normal leading-3 text-black">
              <div>{{ props.item?.post_num }} {{ $t('content.posts') }}</div>
              <div class="mx-2 text-sm font-normal leading-3 text-gray-57">•</div>
              <div>{{ viewCount }} {{ $t('content.view') }}</div>
            </div>
            <div class="line-clamp-2 text-base font-normal leading-5 text-black">
              {{ props.item?.description }}
            </div>
          </div>
        </div>
      </div>
      <!-- 這是豆腐遙遠的夢想，他想要跟Facebook一樣，可以刪除不想看到的創作者，減少曝光度，先不要刪掉 -->
      <div v-show="false" class="absolute right-20 top-20 cursor-pointer">
        <Icon name="close" size="20"></Icon>
      </div>
    </div>
  </Link>
</template>
<script setup>
import { computed } from 'vue'
import Link from '@comp/common/Link.vue'
import Avatar from '@comp/multimedia/Avatar.vue'
import { useRouters } from '@use/routers'
import { toKMBTString } from '@/utils/string-helper'

const { toCreator } = useRouters()

const props = defineProps({
  item: {
    type: Object,
    default: () => ({
      background: null,
      thumb: null,
      nickname: 'Angelababy',
      username: '@angelababy',
      description: `🇩🇪/🇺🇸 - 19 years😇 check my link to get to know me <3, I'm convinced your massive dick will help me get to the spread, daddy💦💦`,
      post_num: 5,
      videos_count: 5100,
    }),
  },
})

const viewCount = computed(() => toKMBTString(props.item?.view_count ?? 0, 1))
</script>
