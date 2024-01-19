import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useEmailLoginStore = defineStore('email-login-store', () => {
  const email = ref('')
  const verifyCode = ref('')
  const password = ref('')

  return {
    email,
    password,
    verifyCode,
  }
})
