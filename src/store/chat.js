import { computed, reactive, readonly, ref, watch } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { useAccountStore } from '@/store/account'
import { useCreatorStore } from '@/store/creator'
import useRequest from '@use/request'
import { useInfinite } from '@use/request/infinite'
import { SEND_STATUS } from '@const/chat'

export const useChatStore = defineStore('chat', () => {
  /**
   * {
   *   [uuid]: {
   *     uuid,
   *     avatar,
   *     username,
   *     nickname,
   *     loading,  // 正在取得歷史資料中
   *     noMore,   // 沒有更多歷史資料可以取得了
   *     messages: [
   *       {
   *         id
   *         timestamp
   *         content
   *         contentType: 'text' | 'photos'
   *         self: boolean,
   *         status: SEND_STATUS,
   *         unread: boolean,
   *       }
   *     ]
   *   },
   *   ...
   * }
   */
  const userMap = reactive(new Map())

  // 傳送成功只會通知你 sign id，我只好用這個來暫存 sign id 對應到的 toUUID，才能直接從 userMap 查到
  const sendingMessagesMap = new Map()

  // 歷史聊天記錄表同步是否完成
  const ready = ref(false)

  const accountStore = useAccountStore()
  const { isLogin } = storeToRefs(accountStore)

  if (!import.meta.env.SSR) {
    watch(
      isLogin,
      (login) => {
        if (login) {
          syncHistory()
        } else {
          clearALL()
        }
      },
      { immediate: true },
    )
  }

  const sortedUsers = computed(() => {
    const r = Array.from(userMap.values())
    r.sort((a, b) => {
      const av = a.messages[a.messages.length - 1]?.timestamp || -1
      const bv = b.messages[b.messages.length - 1]?.timestamp || -1
      return bv - av
    })
    return r
  })

  const totalUnreadCount = computed(() => userMap.reduce((r, u) => r + u.messages.filter((m) => m.unread), 0))

  async function getUser(uuid) {
    await checkUserMapExists(uuid)
    return userMap.get(uuid)
  }

  async function pushSelfMessage(message) {
    const { sign: id, to_uuid: toUUID, microtime: timestamp, content, msgType: contentType } = message

    await checkUserMapExists(toUUID)

    userMap.get(toUUID).messages.push({
      id,
      timestamp,
      content,
      contentType,
      self: true,
      status: SEND_STATUS.SENDING,
    })

    sendingMessagesMap.set(id, toUUID)
  }

  function selfMessageSendSuccess(id) {
    selfMessageUpdate(id, 'status', SEND_STATUS.SUCCESS)

    sendingMessagesMap.delete(id)
  }

  function selfPhotoUploaded(id, url) {
    selfMessageUpdate(id, 'content', url)
  }

  function selfMessageUpdate(id, key, value) {
    if (!sendingMessagesMap.has(id)) {
      throw new Error('Self message success setting error...')
    }

    const toUUID = sendingMessagesMap.get(id)

    const messages = userMap.get(toUUID).messages
    for (let i = messages.length - 1; i >= 0; i--) {
      const message = messages[i]
      if (message.id === id) {
        message[key] = value
        break
      }
    }
  }

  async function pushOtherMessage(message) {
    const { sign: id, from_uuid: fromUUID, timestamp, content, content_type: contentType } = message

    await checkUserMapExists(fromUUID)

    userMap.get(fromUUID).messages.push({
      id,
      timestamp: timestamp * 1000, // 後端傳來的沒有毫秒...XD
      content,
      contentType,
      self: false,
      status: SEND_STATUS.SUCCESS,
      unread: true /* 後端無法完整解決前端暫時補一個上去的 */,
    })
  }

  async function checkUserMapExists(uuid) {
    if (!userMap.has(uuid)) {
      const { getByUUID } = useCreatorStore()
      const creator = await getByUUID(uuid)
      initUser(uuid, creator.thumb, creator.username, creator.nickname)
    }
  }

  function syncHistory() {
    if (userMap.size > 0 || sendingMessagesMap.size > 0) {
      throw new Error('You cannot syncHistory, userMap or sendingMessagesMap still have data...')
    }

    ready.value = false
    useRequest('Chat.contactList', { immediate: true })
      .then((d) => {
        console.log(d)
      })
      .catch((e) => console.error(e))
      .finally(() => (ready.value = true))

    const { dataList, init } = useInfinite('Chat.history', {
      params: { from_uuid: '562bd541c366d6d64e946b453b34ed35' },
    })
    init()
      .then(() => {
        console.log(dataList.value)
      })
      .catch((e) => console.error(e))
  }

  function initUser(uuid, avatar, username, nickname, messages = []) {
    userMap.set(uuid, {
      uuid,
      avatar,
      username,
      nickname,
      messages,
      loading: false,
      noMore: false,
    })
    // userHistoryFetcherMap.set(
    //   id,
    //   useInfinite({
    //     request: API.Chat.getHistory,
    //     params: { from_uuid: uuid },
    //     limit: 20,
    //   }),
    // )
  }

  function clearALL() {
    userMap.clear()
    sendingMessagesMap.clear()
  }

  return {
    sortedUsers,
    totalUnreadCount,
    ready: readonly(ready),
    getUser,
    pushSelfMessage,
    selfMessageSendSuccess,
    selfPhotoUploaded,
    pushOtherMessage,
  }
})
