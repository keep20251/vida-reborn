<template>
  <div
    class="flex h-screen grow basis-full flex-row justify-start py-20 sm:basis-[540px] md:basis-[860px] xl:basis-[880px]"
  >
    <div class="scrollbar-md border-l-gray-e5 mx-8 h-full w-[384px] overflow-auto border-l px-20 py-20">
      <div class="flex flex-col space-y-20">
        <div class="text-lg font-bold leading-lg">Messages</div>
        <List :items="users" item-key="id">
          <template #default="{ item, last }">
            <div class="hover:bg-gray-f6 flex cursor-pointer space-x-15 p-10" :class="{ 'border-b': !last }">
              <div class="h-60 w-60 shrink-0 rounded-full bg-orange-200"></div>
              <div class="grow">
                <div>
                  <span class="text-base font-bold">{{ item.nickname }}</span>
                  <span class="text-sm"> @{{ item.username }}</span>
                </div>
                <div class="text-base leading-lg">{{ item.message }}</div>
              </div>
              <div class="flex flex-col items-end justify-between">
                <div class="text-sm text-primary">{{ item.time }}</div>
                <Badge v-if="item.unread > 0">{{ item.unread }}</Badge>
              </div>
            </div>
          </template>
        </List>
      </div>
    </div>
    <div class="border-gfay10 w-[600px] rounded-md border px-50 py-30"></div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Badge from '@comp/common/Badge.vue'
import List from '@comp/common/List.vue'

const users = ref([
  {
    id: 1,
    nickname: 'Tommy',
    username: 'tommy',
    time: '13:01',
    message: '[Photo]',
    unread: 0,
  },
  {
    id: 2,
    nickname: 'Charlie',
    username: 'tommy',
    time: '13:01',
    message: '[Video]',
    unread: 1,
  },
  {
    id: 3,
    nickname: 'Tommy',
    username: 'tommy',
    time: '13:01',
    message: '[Photo]',
    unread: 999,
  },
  {
    id: 4,
    nickname: 'Sophie',
    username: 'sophie',
    time: '13:01',
    message: 'Can’t believe you blocked me! What’s wrong with you???',
    unread: 5,
  },
  {
    id: 5,
    nickname: 'Tommy',
    username: 'tommy',
    time: '13:01',
    message: '[Photo]',
    unread: 0,
  },
  {
    id: 6,
    nickname: 'Charlie',
    username: 'tommy',
    time: '13:01',
    message: '[Video]',
    unread: 0,
  },
  {
    id: 7,
    nickname: 'Tommy',
    username: 'tommy',
    time: '13:01',
    message: '[Photo]',
    unread: 5,
  },
  {
    id: 8,
    nickname: 'Charlie',
    username: 'tommy',
    time: '13:01',
    message: '[Video]',
    unread: 5,
  },
  {
    id: 9,
    nickname: 'Charlie',
    username: 'tommy',
    time: '13:01',
    message: '[Video]',
    unread: 5,
  },
  {
    id: 10,
    nickname: 'Charlie',
    username: 'tommy',
    time: '13:01',
    message: '[Video]',
    unread: 5,
  },
  {
    id: 11,
    nickname: 'Charlie',
    username: 'tommy',
    time: '13:01',
    message: '[Video]',
    unread: 50,
  },
])
</script>
