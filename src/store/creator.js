import { reactive } from 'vue'
import { whenever } from '@vueuse/core'
import { defineStore, storeToRefs } from 'pinia'
import { useAccountStore } from '@/store/account'
import useRequest from '@use/request'

export const useCreatorStore = defineStore('creator', () => {
  /**
   * {
   *   [username]: {
   *     後端傳來的內容
   *   },
   *   ...
   * }
   */
  const creatorsMap = reactive(new Map())

  // 某些情境下會出現只有使用者 uuid 而取不到 username(私訊)
  // 提供一個 uuid 對應 username 的表
  const uuidToUsername = {}

  const inRequesting = {}

  const accountStore = useAccountStore()
  const { isLogin } = storeToRefs(accountStore)
  if (!import.meta.env.SSR) {
    whenever(isLogin, clear)
  }

  async function get(username) {
    if (creatorsMap.has(username)) {
      return creatorsMap.get(username)
    }

    if (inRequesting[username]) {
      const { request, promise } = inRequesting[username]
      await promise
      return setupCreator(username, request.data.value)
    }

    const request = useRequest('User.otherInfo', { params: { uuid: username } })
    const promise = request.execute()
    inRequesting[username] = { request, promise }

    try {
      await promise
      return setupCreator(username, request.data.value)
    } finally {
      delete inRequesting[username]
    }
  }

  async function getByUUID(uuid) {
    const username = uuidToUsername[uuid]

    if (!username) {
      const data = await useRequest('User.otherInfo', { params: { uuid }, immediate: true })
      return setupCreator(data.username, data)
    } else {
      return await get(username)
    }
  }

  function setupCreator(username, data) {
    if (!creatorsMap.has(username)) {
      put(username, data)
    }
    return creatorsMap.get(username)
  }

  function put(username, data) {
    creatorsMap.set(username, data)
    uuidToUsername[data.uuid] = username
  }

  /**
   * Hydration 時用來還原後端已經取得過的創作者
   *
   * @param {*} data creator data
   * @return creator in creatorsMap
   */
  function revert(data) {
    if (!data) return data

    if (creatorsMap.has(data.username)) {
      throw new Error(`Creator '${data.username}' already exist, but you still revert it?`)
    }
    return setupCreator(data.username, data)
  }

  function clear() {
    Promise.all(Object.values(inRequesting).map((r) => r.promise)).then(() => {
      creatorsMap.clear()
      for (const k in uuidToUsername) delete uuidToUsername[k]
    })
  }

  function toggleBlock(username, isBlock) {
    if (creatorsMap.has(username)) {
      creatorsMap.get(username).is_block = isBlock
    }
  }

  return {
    get,
    getByUUID,
    revert,
    clear,

    toggleBlock,
  }
})
