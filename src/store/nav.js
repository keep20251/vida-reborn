import { readonly, ref } from 'vue'
import { defineStore } from 'pinia'

export const useNavStore = defineStore('nav', () => {
  const isShow = ref(true)

  function show() {
    isShow.value = true
  }

  function hide() {
    isShow.value = false
  }

  return {
    isShow: readonly(isShow),

    show,
    hide,
  }
})
