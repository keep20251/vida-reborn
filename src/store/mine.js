import { readonly, ref } from 'vue'
import { syncRef } from '@vueuse/core'
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

  // Mine.vue 內的 Page 組件的 main-top Tab 組建內容，由子層元件設定
  const tab = ref(null)
  const tabOptions = ref(null)
  let stopSyncTab
  function setTab(tabRef, _tabOptions) {
    stopSyncTab = syncRef(tabRef, tab)
    tabOptions.value = _tabOptions
  }
  function clearTab() {
    stopSyncTab && stopSyncTab()
    tab.value = null
    tabOptions.value = null
  }

  // Mine.vue 內的 Page 組件的 next 函式，由子層元件設定
  const nextFn = ref(null)
  function setNextFn(fn) {
    nextFn.value = fn
  }
  function clearNextFn() {
    nextFn.value = null
  }

  // Mine.vue 內的 Page 組件的 reload 函式，由子層元件設定
  const reloadFn = ref(null)
  function setReloadFn(fn) {
    reloadFn.value = fn
  }
  function clearReloadFn() {
    reloadFn.value = null
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

    tab,
    tabOptions: readonly(tabOptions),
    setTab,
    clearTab,

    nextFn: readonly(nextFn),
    setNextFn,
    clearNextFn,

    reloadFn: readonly(reloadFn),
    setReloadFn,
    clearReloadFn,
  }
})
