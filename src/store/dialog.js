import { ref } from 'vue'
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

  return {
    authDialog,
    fileSelectDialog,
    subPlanDialog,
    subscriptionDialog,
  }
})
