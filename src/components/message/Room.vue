<template>
  <div v-if="errMsg" class="flex h-full items-center justify-center text-warning">{{ errMsg }}</div>
  <div v-else-if="isClose" class="flex h-full items-center justify-center">X_X!</div>
  <div v-else-if="!ready || loading || isConnecting" class="flex h-full items-center justify-center">
    <Loading></Loading>
  </div>
  <div v-else-if="user === null" class="flex h-full items-center justify-center text-xl font-bold">
    {{ $t('info.pickMessage') }}
  </div>
  <div v-else class="flex h-full flex-col space-y-10">
    <div class="flex items-center justify-center space-x-10">
      <div class="flex cursor-pointer" @click="$emit('back')">
        <Icon name="back" size="20"></Icon>
      </div>
      <div class="cursor-pointer" @click="toCreator(user.username)">
        <Avatar :radius="20" :src="user.avatar"></Avatar>
      </div>
      <div class="flex-grow text-base font-bold">
        <span class="cursor-pointer" @click="toCreator(user.username)">{{ user.nickname }}</span>
      </div>
      <!-- <div class="flex cursor-pointer">
        <Icon name="moreHorizontal" size="20"></Icon>
      </div> -->
    </div>
    <div class="h-1 bg-gray-e5"></div>
    <div
      class="scrollbar-md flex grow flex-col space-y-15 overflow-x-hidden md:w-[calc(100%+30px)]"
      ref="messages"
      @scroll="onScroll"
    >
      <div class="flex items-center justify-center py-8 text-gray-a3">
        <Loading v-if="user.loading"></Loading>
        <span v-if="user.noMore">{{ $t('common.noMore') }}</span>
      </div>
      <MessageBox v-for="m in user.messages" :item="m" :key="m.id" @intersect="m.unread = false"></MessageBox>
    </div>
    <div class="flex items-end justify-center space-x-10">
      <div class="flex h-36 items-center">
        <label class="flex cursor-pointer items-center">
          <Icon name="attach" size="20"></Icon>
          <input
            class="hidden"
            ref="photoInput"
            type="file"
            accept="image/jpg, image/jpeg, image/png, image/gif"
            @change="sendPhoto"
          />
        </label>
      </div>
      <TextareaWrap
        v-model="input"
        class="grow"
        :line="inputLine"
        disable-enter-new-line
        @keypress:enter="sendText"
        @keypress:help:enter="input += '\n'"
      ></TextareaWrap>
      <div class="flex h-36 items-center">
        <div class="flex h-30 w-40 cursor-pointer items-center justify-center rounded-xl bg-primary" @click="sendText">
          <Icon name="sendWhite" size="20"></Icon>
        </div>
      </div>
    </div>
  </div>
  <div
    v-if="newMsgCount > 0"
    class="relative -top-66 left-[50%] w-fit -translate-x-[50%] cursor-pointer rounded-md bg-gray-a3 px-12 py-4 text-sm"
    @click="onNewMsgTipClick"
  >
    {{ $t('message.newMessage', { count: newMsgCount }) }}
  </div>
</template>

<script setup>
import debounce from 'lodash/debounce'
import { computed, onBeforeUpdate, onUpdated, ref, shallowRef, watch } from 'vue'
import { useInfiniteScroll } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { useAccountStore } from '@/store/account'
import { useChatStore } from '@/store/chat'
import { useCreatorStore } from '@/store/creator'
import { useModalStore } from '@/store/modal'
import TextareaWrap from '@comp/form/TextareaWrap.vue'
import MessageBox from '@comp/message/MessageBox.vue'
import Avatar from '@comp/multimedia/Avatar.vue'
import { useRouters } from '@use/routers'
import { isClose, isConnecting, sendPhotoMessage, sendTextMessage } from '@/ws'

const props = defineProps({
  uuid: { type: String },
})

defineEmits(['back'])

const accountStore = useAccountStore()
const { isLogin, isCreator } = storeToRefs(accountStore)

const chatStore = useChatStore()
const { ready } = storeToRefs(chatStore)
const { getUser, loadNextHistory } = chatStore

const creatorStore = useCreatorStore()
const { get: getCreator } = creatorStore

const { alert } = useModalStore()

const { toCreator } = useRouters()

const loading = ref(false)
const errMsg = ref('')
const user = shallowRef(null)
watch(
  [ready, () => props.uuid],
  async ([ready, uuid], _, onCleanup) => {
    if (!uuid || !isLogin.value || !ready) {
      loading.value = false
      errMsg.value = ''
      user.value = null
      return
    }

    let cleanup = false
    onCleanup(() => (cleanup = true))

    loading.value = true
    errMsg.value = ''
    user.value = null
    try {
      const newUser = await getUser(uuid)
      if (cleanup) return
      user.value = newUser
      checkNewMessage()
      if (user.value.messages.length === 1) {
        loadNextHistory(user.value.uuid)
      }
    } catch (e) {
      errMsg.value = e.message
    } finally {
      loading.value = false
    }
  },
  { immediate: true },
)

const input = ref('')
const inputLine = computed(() => Math.min(input.value.split('\n').length, 5))
async function sendText() {
  const message = input.value.trim()

  if (!message) return

  if (!(await checkCanSend())) {
    return
  }

  const toUUID = user.value.uuid

  try {
    sendTextMessage(message, toUUID)

    input.value = ''
  } catch (e) {
    console.error(e)
  }
}

const photoInput = ref(null)
async function sendPhoto(evt) {
  if (!(await checkCanSend())) {
    return
  }

  const file = evt.target.files[0]
  if (file) {
    const uuid = user.value.uuid

    try {
      sendPhotoMessage(file, uuid)
    } catch (e) {
      console.error(e)
    }
  }

  photoInput.value.value = null
}

async function checkCanSend() {
  const creator = await getCreator(user.value.username)

  if (!creator.is_able_send_message) {
    alert({ title: 'info.subscribeBeforeChat' })
    return false
  }

  return true
}

const messages = ref(null)
const newMsgCount = ref(0)
useInfiniteScroll(
  messages,
  () => {
    loadNextHistory(props.uuid)
  },
  { distance: 100, direction: 'top', interval: 500 },
)

const onScroll = debounce(({ target: { scrollTop, scrollHeight, clientHeight } }) => {
  // 將新訊息提示關掉
  if (scrollHeight - scrollTop - clientHeight < 10) {
    newMsgCount.value = 0
  }
}, 200)

// 確保訊息更新後 scroll container 是保持在原來位置不會亂跳
let prevMessagesScrollHeight
let prevMessagesScrollTop
let atBottom = true
onBeforeUpdate(() => {
  if (!messages.value) return
  prevMessagesScrollHeight = messages.value.scrollHeight
  prevMessagesScrollTop = messages.value.scrollTop

  // 126 是一個約略估計的高度
  atBottom = prevMessagesScrollHeight - prevMessagesScrollTop - messages.value.clientHeight < 126
})
onUpdated(() => {
  if (!messages.value) return
  const isNewMessage = checkNewMessage()

  // 新訊息改變了 scroll container 高度
  if (isNewMessage) {
    if (atBottom) {
      messages.value.scrollTop = messages.value.scrollHeight
    } else {
      messages.value.scrollTop = prevMessagesScrollTop
      newMsgCount.value += 1
    }
  }

  // 歷史訊息改變了 scroll container 高度
  else {
    const scrollHeightDiff = messages.value.scrollHeight - prevMessagesScrollHeight
    const newScrollTop = scrollHeightDiff + prevMessagesScrollTop
    messages.value.scrollTop = newScrollTop
  }
})
function onNewMsgTipClick() {
  messages.value.scrollTop = messages.value.scrollHeight
  newMsgCount.value = 0
}

// 判別添加進來的訊息是否是新訊息
let prevLastMessageId
function checkNewMessage() {
  const lastMessageId =
    user.value.messages && user.value.messages.length > 0
      ? user.value.messages[user.value.messages.length - 1].id
      : undefined

  // 這是新訊息
  if (lastMessageId !== prevLastMessageId) {
    prevLastMessageId = lastMessageId
    return true
  }

  return false
}
</script>
