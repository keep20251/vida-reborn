import { readonly, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { useRootScrollLock } from '@use/utils/scroll-lock'

export const useDialogStore = defineStore('dialog-store', () => {
  // 帳號相關
  const authDialog = ref(false)

  // 發布帖子
  const fileSelectDialog = ref(false)

  // 創作者訂閱方案設置
  const subPlanDialog = ref(false)

  // 創作者訂閱方案展示
  const subscriptionDialog = ref(false)

  // 帖子適用的訂閱方案展示
  const feedSubscriptionDialog = ref(false)

  const paymentDialog = ref(false)
  const openPayment = () => (paymentDialog.value = true)
  const closePayment = () => (paymentDialog.value = false)

  const { lock, unlock } = useRootScrollLock()
  const checkLock = (v) => (v ? lock() : unlock())
  watch(authDialog, checkLock)
  watch(fileSelectDialog, checkLock)
  watch(subPlanDialog, checkLock)
  watch(subscriptionDialog, checkLock)
  watch(feedSubscriptionDialog, checkLock)
  watch(paymentDialog, checkLock)

  return {
    authDialog,
    fileSelectDialog,
    subPlanDialog,
    subscriptionDialog,
    feedSubscriptionDialog,

    paymentDialog: readonly(paymentDialog),
    openPayment,
    closePayment,
  }
})
