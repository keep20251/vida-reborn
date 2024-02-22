<template>
  <div v-if="errMsg" class="flex h-full items-center justify-center text-warning">{{ errMsg }}</div>
  <div v-else-if="isClose" class="flex h-full items-center justify-center">X_X!</div>
  <div v-else-if="loading || isConnecting" class="flex h-full items-center justify-center"><Loading></Loading></div>
  <div v-else-if="user === null" class="flex h-full items-center justify-center text-xl font-bold">
    {{ $t('info.pickMessage') }}
  </div>
  <div v-else class="flex h-full flex-col space-y-10">
    <div class="flex items-center justify-center space-x-10">
      <div class="flex cursor-pointer" @click="$emit('back')">
        <Icon name="back" size="20"></Icon>
      </div>
      <Avatar :radius="20" :src="user.avatar"></Avatar>
      <div class="flex-grow text-base font-bold">{{ user.nickname }}</div>
      <div class="flex cursor-pointer">
        <Icon name="moreHorizontal" size="20"></Icon>
      </div>
    </div>
    <div class="h-1 bg-gray-e5"></div>
    <div class="scrollbar-md flex grow flex-col space-y-15 overflow-auto md:w-[calc(100%+30px)]">
      <MessageBox v-for="m in user.messages" :item="m" :key="m.id"></MessageBox>
    </div>
    <div class="flex items-center justify-center space-x-10">
      <div class="flex cursor-pointer">
        <Icon name="attach" size="20"></Icon>
      </div>
      <InputWrap v-model="input" class="grow" :appendIconBtn="'sendWhite'" @click:append="send"></InputWrap>
    </div>
  </div>
</template>

<script setup>
import { ref, shallowRef, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useAccountStore } from '@/store/account'
import { useChatStore } from '@/store/chat'
import InputWrap from '@comp/form/InputWrap.vue'
import MessageBox from '@comp/message/MessageBox.vue'
import Avatar from '@comp/multimedia/Avatar.vue'
import { isClose, isConnecting, sendTextMessage } from '@/ws'

const props = defineProps({
  uuid: { type: String },
})

defineEmits(['back'])

const accountStore = useAccountStore()
const { isLogin, isCreator } = storeToRefs(accountStore)

const chatStore = useChatStore()
const { ready } = storeToRefs(chatStore)
const { getUser } = chatStore

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
      // checkNewMessage()
      // loadNextHistory(user.value.id, true)
    } catch (e) {
      errMsg.value = e.message
    } finally {
      loading.value = false
    }
  },
  { immediate: true },
)

const input = ref('')
function send() {
  const message = input.value.trim()

  if (!message) return

  const toUUID = user.value.uuid

  try {
    sendTextMessage(message, toUUID)

    input.value = ''
  } catch (e) {
    console.error(e)
  }
}
</script>
