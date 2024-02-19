import { readonly, ref, shallowRef } from 'vue'
import { defineStore } from 'pinia'

export const useDialogStore = defineStore('dialog-store', () => {
  // 帳號相關
  const authDialog = ref(false)

  // 發布帖子
  const fileSelectDialog = ref(false)

  // 創作者訂閱方案設置
  const subPlanDialog = ref(false)

  // 創作者訂閱方案展示
  const subscriptionDialog = ref(false)

  // 舉報/封鎖 選項
  const reportBlockDialog = ref(false)
  const reportBlockFeed = shallowRef(null)
  function dissSomeone(item) {
    reportBlockDialog.value = true
    reportBlockFeed.value = item
  }
  function closeDiss() {
    reportBlockDialog.value = false
    reportBlockFeed.value = null
  }

  return {
    authDialog,
    fileSelectDialog,
    subPlanDialog,
    subscriptionDialog,

    reportBlockDialog,
    reportBlockFeed,
    dissSomeone,
    closeDiss,
  }
})
