import { readonly, ref } from 'vue'
import { defineStore } from 'pinia'

export const useMineStore = defineStore('mine-store', () => {
  const email = ref('')
  const verifyCode = ref('')
  const nickname = ref('')
  const username = ref('')
  const interested = ref([])

  const isPrvwActive = ref('isVisitor')
  const isPreviewMode = ref(false)

  function activatePreview() {
    isPreviewMode.value = true
  }
  function deactivatePreview() {
    isPreviewMode.value = false
  }

  // MinePost 用來監聽是否需要重新載入
  const postReloadFlag = ref(null)
  function reloadPost() {
    postReloadFlag.value = Date.now()
  }

  // Mine.vue 內的 Page 組件的 next 函式，由子層元件設定
  const nextFn = ref(null)

  function setNextFn(fn) {
    nextFn.value = fn
  }

  function clearNextFn() {
    nextFn.value = null
  }

  return {
    email,
    verifyCode,
    nickname,
    username,
    interested,
    isPrvwActive,

    isPreviewMode,
    activatePreview,
    deactivatePreview,

    postReloadFlag: readonly(postReloadFlag),
    reloadPost,

    nextFn,
    setNextFn,
    clearNextFn,
  }
})
