<template>
  <div class="pb-20 text-lg font-bold leading-lg">{{ $t('label.relCreators') }}</div>
  <div class="grid space-y-10">
    <List :items="creators" item-key="id">
      <template #default="{ item }">
        <div class="mb-10 grid space-y-10 rounded-[0.625rem] bg-[#7FE2D326] px-20 py-15">
          <div class="flex items-center justify-between">
            <div class="flex">
              <Avatar class="mr-10" :radius="50" :src="item.avatar"></Avatar>
              <div class="flex flex-col space-y-4">
                <div class="text-lg font-bold leading-lg">{{ item.name }}</div>
                <div class="text-gray-57 text-sm font-normal leading-3">＠{{ item.username }}</div>
                <div class="flex">
                  <div class="text-gray-57 text-sm font-normal leading-3">
                    {{ item.posts }} {{ $t('content.posts') }}
                  </div>
                  <div class="text-gray-57 mx-2 text-sm font-normal leading-3">•</div>
                  <div class="text-gray-57 text-sm font-normal leading-3">
                    {{ item.viewed }} {{ $t('content.view') }}
                  </div>
                </div>
              </div>
            </div>
            <div>
              <Button class="!h-24 !px-18 !py-6 !text-sm !leading-3">{{ $t('common.check') }}</Button>
            </div>
          </div>
          <p class="max-w-fit overflow-hidden text-ellipsis whitespace-nowrap text-base font-normal leading-lg">
            {{ item.info }}
          </p>
        </div>
      </template>
      <template #bottom>
        <div class="flex cursor-pointer items-center justify-center space-x-5 text-base font-bold leading-md">
          <div>{{ $t('content.showMoreCreators') }}</div>
          <Icon name="drop" size="12"></Icon>
        </div>
      </template>
    </List>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import Button from '@comp/common/Button.vue'
import List from '@comp/common/List.vue'
import Avatar from '@comp/multimedia/Avatar.vue'
import defaultAvatar from '@/assets/images/avatar.jpeg'

const creators = ref([
  {
    avatar: defaultAvatar,
    name: 'Angelababy',
    username: 'angelababy',
    posts: 134,
    viewed: 1938,
    info: `🇩🇪/🇺🇸 - 19 years😇 check my link to get to know me &lt; 3, I'm convinced your massive dick will help me get to
        the spread, daddy💦💦`,
    id: 1,
  },
  {
    avatar: defaultAvatar,
    name: 'Angelababy',
    username: 'angelababy',
    posts: 134,
    viewed: 1938,
    info: `🇩🇪/🇺🇸 - 19 years😇 check my link to get to know me &lt; 3, I'm convinced your massive dick will help me get to
        the spread, daddy💦💦`,
    id: 2,
  },
  {
    avatar: defaultAvatar,
    name: 'Angelababy',
    username: 'angelababy',
    posts: 134,
    viewed: 1938,
    info: `🇩🇪/🇺🇸 - 19 years😇 check my link to get to know me &lt; 3, I'm convinced your massive dick will help me get to
        the spread, daddy💦💦`,
    id: 3,
  },
])
</script>
