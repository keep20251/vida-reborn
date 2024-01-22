import { defineStore } from 'pinia'
import { ref } from 'vue'

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
