import { defineStore } from 'pinia'
import { ref } from 'vue'
import useRequest from '@/compositions/request'
import { SEND_EMAIL_PURPOSE } from '@/constant'

export const useEmailLoginStore = defineStore('email-login-store', () => {
  const email = ref('')
  const password = ref('')

  async function sendEmailCode(type = SEND_EMAIL_PURPOSE.FAST_LOGIN) {
    const { execute, data } = useRequest('Account.sendEmailCode')
    // TODO sendEmailCode 需要帶入 account ，這個需求還不明確，之後再回來處理
    await execute({ email: email.value, type, account: 'test-user' })
    return data
  }

  return {
    email,
    password,
    sendEmailCode,
  }
})
