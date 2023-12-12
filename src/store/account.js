import { defineStore, storeToRefs } from 'pinia'
import { computed, watch, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useLocalStorage } from '@vueuse/core'
import { useDialogStore } from '@/store/dialog'
import { LOCAL_STORAGE_KEYS } from '@/constant'

export const useAccountStore = defineStore('account-store', () => {
  // 用來暫存 afterLoginAction 的待執行函式
  // 等待使用者成功登入後再執行
  let tempAction = null

  const router = useRouter()

  const { authDialog } = storeToRefs(useDialogStore())

  // 帳號資訊同步至 localStorage
  const accountRef = useLocalStorage(LOCAL_STORAGE_KEYS.ACCOUNT_INFO, {
    username: null,
    token: null,
    aff: null,
    uuid: null,
    chatToken: null,
  })
  const userData = ref({})

  const isLogin = computed(() => !!accountRef.value.token)
  const username = computed(() => accountRef.value.username)
  const token = computed(() => accountRef.value.token)
  const userId = computed(() => accountRef.value.aff)
  const userUUID = computed(() => accountRef.value.uuid)
  const chatToken = computed(() => accountRef.value.chatToken)

  // dialog 被關掉要復原 tempAction
  watch(authDialog, (isOpen) => {
    if (!isOpen && tempAction) {
      tempAction = null
    }
  })

  function login(data) {
    ;['username', 'token', 'aff', 'uuid', 'chat_token'].forEach((k) => {
      if (!(k in data)) throw new Error(`${k} is required value in data.`)
    })

    // 帳號資訊同步至 localStorage
    accountRef.value.username = data.username
    accountRef.value.token = data.token
    accountRef.value.aff = data.aff
    accountRef.value.uuid = data.uuid
    // chatToken 會在 resetUserData 才被設定
    // 後端說這個token有30天限制，所以要在每次重新回來頁面的時候(/api/member/detail)重設一個

    // 同步使用者其他資料
    resetUserData(data)

    // 關閉 auth dialog
    authDialog.value = false

    // tempAction 有東西就執行
    if (tempAction) {
      const { ctx, args, action } = tempAction
      action.apply(ctx, args)
      tempAction = null
    }
  }

  function logout() {
    accountRef.value.username = null
    accountRef.value.token = null
    accountRef.value.aff = null
    accountRef.value.uuid = null
    accountRef.value.chatToken = null
    clearUserData()

    router.replace('/home')
  }

  /**
   * 包裝一個登入後才能執行的函式(通常都會是在 <script setup> 中的 function)
   * 使外部無需自行驗證是否登入來執行彈窗
   */
  function afterLoginAction(action) {
    return function () {
      const ctx = this
      const args = arguments

      // 已經登入直接執行
      if (isLogin.value) {
        action.apply(ctx, args)
      }
      // 尚未登入，跳出 auth dialog
      else {
        tempAction = { ctx, args, action }
        authDialog.value = true
      }
    }
  }

  function resetUserData(newData) {
    clearUserData()
    setUserData(newData)
  }

  function setUserData(newData) {
    for (const [k, v] of Object.entries(newData)) {
      if (k === 'chat_token') {
        accountRef.value.chatToken = v
      } else {
        userData.value[k] = v
      }
    }
  }

  function clearUserData() {
    for (const k of Object.keys(userData.value)) {
      if (userData.value[k]) delete userData.value[k]
    }
  }

  return {
    isLogin,
    username,
    token,
    userId,
    userUUID,
    chatToken,
    userData,
    login,
    logout,
    afterLoginAction,
    setUserData,
    resetUserData,
  }
})
