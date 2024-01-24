import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useMineStore = defineStore('mine-store', () => {
  const email = ref('')
  const verifyCode = ref('')
  const nickname = ref('')
  const username = ref('')

  return {
    email,
    verifyCode,
    nickname,
    username,
  }
})
