import { ref } from 'vue'
import { defineStore } from 'pinia'

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
