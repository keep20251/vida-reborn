import { reactive } from 'vue'
import { defineStore } from 'pinia'
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

  const inRequesting = {}

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

  function setupCreator(username, data) {
    if (!creatorsMap.has(username)) {
      creatorsMap.set(username, data)
    }
    return creatorsMap.get(username)
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
    creatorsMap.set(data.username, data)
    return creatorsMap.get(data.username)
  }

  function clear() {
    Promise.all(Object.values(inRequesting).map((r) => r.promise)).then(() => {
      creatorsMap.clear()
    })
  }

  return {
    get,
    revert,
    clear,
  }
})
