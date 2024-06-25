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
  const userHistoryFetcherMap = new Map()

  // 傳送成功只會通知你 sign id，我只好用這個來暫存 sign id 對應到的 toUUID，才能直接從 userMap 查到
  const sendingMessagesMap = new Map()

  // 歷史聊天記錄表同步是否完成
  const ready = ref(false)

  const accountStore = useAccountStore()
  const { isLogin, userUUID } = storeToRefs(accountStore)

  const { isLoading: syncingHistory, execute: execSyncHistory } = useRequest('Chat.contactList')

  if (!import.meta.env.SSR) {
    watch(
      isLogin,
      (login) => {
        if (login) {
          syncHistory()
        } else {
          clearAll()
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

    if (syncingHistory.value) {
      return
    }

    ready.value = false
    execSyncHistory()
      .then((d) => {
        for (const { user, message } of d.list) {
          // 這是聊天對象的資訊
          const { uuid, thumb, username, nickname } = user
          initUser(uuid, thumb, username, nickname, [makeHistoryMessage(message)])
        }
      })
      .catch((e) => console.error(e))
      .finally(() => (ready.value = true))
  }

  async function loadNextHistory(otherUUID) {
    await checkUserMapExists(otherUUID)

    const { next, isLoading, noMore } = userHistoryFetcherMap.get(otherUUID)
    if (isLoading.value || noMore.value) {
      return
    }

    const user = userMap.get(otherUUID)
    const userMessages = user.messages

    try {
      user.loading = true

      // 讀取歷史訊息後放入 user.messages 中
      const historyMessages = await next()
      historyMessages.forEach((hm, i) => {
        // 一開始 getContactList 會有第一筆，然後接下去的第一次 getHistory 的第一筆應該會是相同的，這時候要跳過
        if (i === 0 && userMessages[0] && userMessages[0].id === hm.sign) {
          return
        }
        userMessages.unshift(makeHistoryMessage(hm))
      })

      user.noMore = noMore.value
    } catch (e) {
      console.error(e)
    } finally {
      user.loading = false
    }
  }

  function makeHistoryMessage(message) {
    const self = message.from_uuid === userUUID.value
    return {
      _id: message.id, // 這才是後端產生的真正訊息id，但我當初發送的時候只能用發送端的 sign 當成他的 id，所以還是保留這種情況
      id: message.sign,
      timestamp: message.created_at * 1000, // 後端傳來的沒有毫秒...XD
      content: message.content,
      contentType: message.content_type || 'text', // 據說如果是 text 的話後端可能會傳空字串
      self,
      status: SEND_STATUS.SUCCESS,
      unread: !self && !!message.need_send, // need_send 0已讀 1未讀
    }
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
    userHistoryFetcherMap.set(uuid, useInfinite('Chat.history', { params: { from_uuid: uuid }, limit: 20 }))
  }

  function clearAll() {
    userMap.clear()
    userHistoryFetcherMap.clear()
    sendingMessagesMap.clear()
  }

  function reload() {
    clearAll()
    syncHistory()
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
    loadNextHistory,
    reload,
  }
})
