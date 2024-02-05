<template>
  <ClientOnly>
    <PageMessage :messaging="toId !== null">
      <template #default>
        <div class="flex flex-col space-y-20">
          <div v-if="isDesktop" class="px-20 text-lg font-bold leading-lg">Messages</div>
          <List :items="users" item-key="id">
            <template #default="{ item, last }">
              <div
                class="flex cursor-pointer space-x-15 px-20 py-10 hover:bg-gray-f6"
                :class="{ 'bg-gray-f6': item.id === toId }"
                @click="messageTo(item.id)"
              >
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
              <div v-if="!last" class="h-1 w-[calc(100%-115px)] translate-x-95 bg-gray-e5"></div>
            </template>
          </List>
        </div>
      </template>
      <template #room>
        <Room :id="toId" @back="messageTo(null)"></Room>
      </template>
    </PageMessage>
  </ClientOnly>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/store/app'
import Badge from '@comp/common/Badge.vue'
import List from '@comp/common/List.vue'
import PageMessage from '@comp/layout/PageMessage.vue'
import Room from '@comp/message/Room.vue'
import { useRouters } from '@use/routers'

const appStore = useAppStore()
const { isDesktop } = storeToRefs(appStore)

const { updateParams } = useRouters()

const route = useRoute()
const toId = ref(processId())

function processId() {
  if (/^\d+$/.test(route.params.to)) {
    return parseInt(route.params.to)
  } else {
    updateParams({ params: { to: '' } })
    return null
  }
}

function messageTo(id) {
  updateParams({ params: { to: id || '' } })
  toId.value = id
}

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
