import md5 from 'md5'
import { computed, ref, watch } from 'vue'
import { useWebSocket } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { useAccountStore } from '@/store/account'
import { useAppStore } from '@/store/app'
import { useChatStore } from '@/store/chat'
import { DecryptIm, EncryptIm } from '@/utils/crypto-data'
import uploadImage from '@/http/upload/uploadImage'

const RECONNECT_DELAY = 3000
const HEARTBEAT_INTERVAL = 8000

let oauth

let token
let via

const _status = ref('CLOSED')
let _send

export const isOpen = computed(() => _status.value === 'OPEN')
export const isConnecting = computed(() => _status.value === 'CONNECTING')
export const isClose = computed(() => _status.value === 'CLOSED')

export function init({ oauthId, oauthType = 'pwa' } = {}) {
  oauth = { id: oauthId, type: oauthType }

  const { appConfig } = useAppStore()
  const { im_url: imUrl, via: chatVia } = appConfig

  const url = imUrl[Math.floor(Math.random() * imUrl.length)]

  const accountStore = useAccountStore()
  const { isLogin, chatToken } = storeToRefs(accountStore)

  const { status, data, send, open, close } = useWebSocket(url, {
    immediate: false,
    autoReconnect: {
      delay: RECONNECT_DELAY,
    },
    heartbeat: {
      message: `{"route":"chat/ping","via":"${chatVia}"}`,
      interval: HEARTBEAT_INTERVAL,
    },
    onConnected: initUser,
    onMessage,
    onError,
  })

  via = chatVia
  _send = send

  /**
   * 內部 status 轉接至外部
   */
  watch(
    status,
    (v) => {
      _status.value = v
    },
    { immediate: true },
  )

  /**
   * 監控登入狀態決定開啟或關閉 ws
   */
  watch(
    isLogin,
    (login) => {
      if (login) {
        // token 會在每次登入都被更新
        token = chatToken.value
        open()
      } else {
        token = null
        close()
      }
    },
    { immediate: true },
  )
}

export function sendTextMessage(content, toUUID) {
  if (typeof content !== 'string' || content === '') {
    throw new Error('Send text content error: ', content)
  }
  if (!toUUID) {
    throw new Error("Receiver's uuid is required...")
  }

  const accountStore = useAccountStore()
  const { userUUID } = storeToRefs(accountStore)

  if (toUUID === userUUID.value) {
    throw new Error('You can not chat to self...')
  }

  const microtime = +new Date()
  const ackId = md5(`${toUUID}${microtime}${Math.floor(Math.random() * 1000) + 1}`)
  const data = {
    to_uuid: toUUID,
    type: 'friend',
    msgType: 'text',
    content,
    microtime,
    sign: ackId,
  }

  sendMessage('chat/chat', data, ackId)

  const chatStore = useChatStore()
  const { pushSelfMessage } = chatStore
  pushSelfMessage({ ...data })
}

export function sendPhotoMessage(file, toUUID) {
  if (!(file instanceof File)) {
    throw new Error('Not file interface...')
  }
  if (!['image/jpg', 'image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
    throw new Error('file type error, not support', file.type)
  }
  if (!toUUID) {
    throw new Error("Receiver's uuid is required...")
  }

  const accountStore = useAccountStore()
  const { userUUID } = storeToRefs(accountStore)

  if (toUUID === userUUID.value) {
    throw new Error('You can not chat to self...')
  }

  const chatStore = useChatStore()
  const { pushSelfMessage, selfPhotoUploaded } = chatStore

  const microtime = +new Date()
  const ackId = md5(`${toUUID}${microtime}${Math.floor(Math.random() * 1000) + 1}`)
  const data = {
    to_uuid: toUUID,
    type: 'friend',
    msgType: 'photos',
    microtime,
    sign: ackId,
  }

  pushSelfMessage({ ...data })
  uploadImage(file, () => {}).then((url) => {
    data.content = url
    sendMessage('chat/chat', data, ackId)
    selfPhotoUploaded(data.sign, data.content)
  })
}

function sendMessage(route, data, ackId) {
  if (!_send) {
    throw new Error('IM call sendMessage before initialize...')
  }

  if (!(route && typeof route === 'string' && route.startsWith('chat/'))) {
    throw new Error(`IM sendMessage route error ${route}`)
  }

  const message = {
    route,
    via,
    token,
    encrypt: 'self',
  }

  if (data) {
    const encryptData = EncryptIm({ ...data })
    message.data = encryptData

    if (ackId) {
      message.ack_id = ackId
    }
  }

  console.log('IM req:', message)

  if (!_send(JSON.stringify(message))) {
    console.warn('You send ws message when disconnected...', message)
  }
}

function initUser() {
  const accountStore = useAccountStore()
  const { userUUID, userData } = storeToRefs(accountStore)

  sendMessage('chat/initUser', {
    uuid: userUUID.value,
    phone: userData.value.phone || '1234', // 請教某位後端高人，他說沒有隨便亂傳也可以
    nickname: userData.value.nickname,
    avatar: userData.value.avatar,
    oauth_id: oauth.id,
    oauth_ads_id: oauth.id,
    oauth_type: oauth.type,
  })
}

function onMessage(ws, { data }) {
  const dataObj = JSON.parse(data)

  console.log('IM res:', dataObj)

  if (dataObj === 'pone') return

  const { message_type: type, data: messageData, confirmed_ack_id: ackId } = dataObj

  const chatStore = useChatStore()
  const { selfMessageSendSuccess, pushOtherMessage } = chatStore
  switch (type) {
    case 'chatMessage':
      pushOtherMessage(DecryptIm(messageData))
      break
    case 'ackMessage':
      selfMessageSendSuccess(ackId)
      break
    case 'error':
      console.warn('IM error', dataObj)
      break
  }
}

function onError(ws, e) {
  console.warn('ws error: ', e)
}
