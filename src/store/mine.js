import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useMineStore = defineStore('mine-store', () => {
  const email = ref('')
  const verifyCode = ref('')
  const nickname = ref('')
  const username = ref('')
  const interested = ref([])
  const isPrvwActive = ref('isVisitor')

  // Mine.vue 內的 Page 組件的 next 函式，由子層元件設定
  const nextFn = ref(null)

  function setNextFn(fn) {
    nextFn.value = fn
  }

  function clearNextFn(fn) {
    nextFn.value = null
  }

  return {
    email,
    verifyCode,
    nickname,
    username,
    interested,
    isPrvwActive,

    setNextFn,
    clearNextFn,
  }
})
