import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { defineStore, storeToRefs } from 'pinia'
import { useDialogStore } from '@/store/dialog'
import useRequest from '@use/request/index.js'
import { useCookie } from '@use/utils/cookie'
import { COOKIE_KEY } from '@const'

export const useAccountStore = defineStore('account-store', () => {
  // 用來暫存 afterLoginAction 的待執行函式
  // 等待使用者成功登入後再執行
  let tempAction = null

  const router = useRouter()

  const { authDialog } = storeToRefs(useDialogStore())

  const tokenCookie = useCookie(COOKIE_KEY.AUTH, { default: '' })
  const usernameCookie = useCookie(COOKIE_KEY.USERNAME, { default: '' })
  const affCookie = useCookie(COOKIE_KEY.AFF, { default: '' })
  const uuidCookie = useCookie(COOKIE_KEY.UUID, { default: '' })
  const chatTokenCookie = useCookie(COOKIE_KEY.CHAT_TOKEN, { default: '' })

  const userData = ref(null)

  const isLogin = computed(() => !!tokenCookie.value)
  const username = computed(() => usernameCookie.value)
  const token = computed(() => tokenCookie.value)
  const userId = computed(() => affCookie.value)
  const userUUID = computed(() => uuidCookie.value)
  const chatToken = computed(() => chatTokenCookie.value)

  // dialog 被關掉要復原 tempAction
  watch(authDialog, (isOpen) => {
    if (!isOpen && tempAction) {
      tempAction = null
    }
  })

  async function login(token) {
    tokenCookie.value = token

    let data
    try {
      data = await useRequest('User.info', { immediate: true })
      ;['username', 'aff', 'uuid'].forEach((k) => {
        if (!(k in data)) throw new Error(`${k} is required value in data.`)
      })
    } catch (e) {
      tokenCookie.value = ''
      throw e
    }

    // 使用者唯一辨識塞進 cookie
    usernameCookie.value = data.username
    affCookie.value = data.aff
    uuidCookie.value = data.uuid

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
    tokenCookie.value = ''

    usernameCookie.value = ''
    tokenCookie.value = ''
    affCookie.value = ''
    uuidCookie.value = ''
    chatTokenCookie.value = ''
    clearUserData()

    router.replace({ name: 'home' })
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
        chatTokenCookie.value = v
      }
    }
    userData.value = newData
  }

  function clearUserData() {
    userData.value = null
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
