<template>
  <ClientOnly>
    <PageMessage :messaging="msgingUUID !== null">
      <template #default>
        <div v-if="ready" class="flex flex-col">
          <div v-if="isDesktop" class="mb-20 px-20 text-lg font-bold leading-lg">Messages</div>
          <List :items="sortedUsers" item-key="uuid">
            <template #default="{ item, last }">
              <div
                class="flex cursor-pointer space-x-15 px-20 py-10 hover:bg-gray-f6"
                :class="{ 'bg-gray-f6': item.uuid === msgingUUID }"
                @click="messageTo(item)"
              >
                <Avatar :radius="30" :src="item.avatar"></Avatar>
                <div class="grow">
                  <div class="flex items-center space-x-5">
                    <div class="line-clamp-1 text-base font-bold">{{ item.nickname }}</div>
                    <div class="text-sm">@{{ item.username }}</div>
                  </div>
                  <div
                    class="line-clamp-2 whitespace-pre-line text-base leading-lg"
                    :style="{ 'word-break': 'break-word' }"
                  >
                    {{
                      item.messages.length === 0
                        ? ''
                        : item.messages[item.messages.length - 1].contentType === 'photos'
                          ? $t('message.imageSended')
                          : item.messages[item.messages.length - 1].content
                    }}
                  </div>
                </div>
                <div class="flex flex-col items-end justify-between">
                  <div class="text-sm text-primary">
                    {{
                      item.messages[item.messages.length - 1]
                        ? toDateTimeString(new Date(item.messages[item.messages.length - 1].timestamp)).substring(
                            11,
                            16,
                          )
                        : ''
                    }}
                  </div>
                  <Badge v-if="item.messages.filter((m) => m.unread).length > 0">{{
                    item.messages.filter((m) => m.unread).length
                  }}</Badge>
                </div>
              </div>
              <div v-if="!last" class="h-1 w-[calc(100%-115px)] translate-x-95 bg-gray-e5"></div>
            </template>
          </List>
          <NoData v-if="sortedUsers.length === 0"></NoData>
        </div>
        <div v-else class="flex h-full items-center justify-center"><Loading></Loading></div>
      </template>
      <template #room>
        <Room :uuid="msgingUUID" @back="messageTo(null)"></Room>
      </template>
    </PageMessage>
  </ClientOnly>
</template>

<script setup>
import { onActivated, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/store/app'
import { useChatStore } from '@/store/chat'
import { useCreatorStore } from '@/store/creator'
import { useNavStore } from '@/store/nav'
import Badge from '@comp/common/Badge.vue'
import NoData from '@comp/info/NoData.vue'
import PageMessage from '@comp/layout/PageMessage.vue'
import Room from '@comp/message/Room.vue'
import Avatar from '@comp/multimedia/Avatar.vue'
import { useRouters } from '@use/routers'
import { toDateTimeString } from '@/utils/string-helper'

const appStore = useAppStore()
const { isDesktop } = storeToRefs(appStore)

const navStore = useNavStore()
const { show, hide } = navStore

const chatStore = useChatStore()
const { ready, sortedUsers } = storeToRefs(chatStore)

const { updateParams } = useRouters()

const msgingUUID = ref(null)

watch(
  msgingUUID,
  (v) => {
    v === null ? show() : hide()
  },
  { immediate: true },
)

const route = useRoute()
const creatorStore = useCreatorStore()
const { get: getCreator } = creatorStore
onActivated(async () => {
  const username = route.params.to

  if (username && username !== '') {
    const creator = await getCreator(username)
    msgingUUID.value = creator.uuid
  } else {
    messageTo(null)
  }
})

function messageTo(user) {
  if (user === null) {
    updateParams({ params: { to: '' } })
    msgingUUID.value = null
  } else {
    updateParams({ params: { to: user.username } })
    msgingUUID.value = user.uuid
  }
}
</script>
