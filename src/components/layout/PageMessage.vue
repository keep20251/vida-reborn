<template>
  <div
    class="flex h-screen py-20 grow basis-full flex-row justify-start sm:basis-[540px] md:basis-[860px] xl:basis-[880px]"
  >
    <div class="w-[384px] h-full px-20 mx-8 py-20 border-l border-l-gray10 scrollbar-md overflow-auto">
      <div class="flex flex-col space-y-20">
        <div class="text-lg font-bold leading-lg">Messages</div>
        <List :items="users" item-key="id">
          <template #default="{ item, last }">
            <div class="flex space-x-15 p-10 cursor-pointer hover:bg-gray03" :class="{ 'border-b': !last }">
              <div class="w-60 h-60 shrink-0 rounded-full bg-orange-200"></div>
              <div class="grow">
                <div>
                  <span class="text-base font-bold">{{ item.nickname }}</span>
                  <span class="text-sm"> @{{ item.username }}</span>
                </div>
                <div class="text-base leading-lg">{{ item.message }}</div>
              </div>
              <div class="flex flex-col justify-between items-end">
                <div class="text-sm text-primary">{{ item.time }}</div>
                <div
                  v-if="item.unread > 0"
                  class="w-20 bg-primary text-white flex justify-center items-center text-sm rounded-full"
                >
                  {{ item.unread }}
                </div>
              </div>
            </div>
          </template>
        </List>
      </div>
    </div>
    <div class="w-[600px] px-50 py-30 border border-gfay10 rounded-md"></div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
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
    unread: 5,
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
