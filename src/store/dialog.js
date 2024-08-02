import { readonly, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { useRootScrollLock } from '@use/utils/scroll-lock'
import { useEscapeClose } from '@/compositions/utils/escape-close'

export const useDialogStore = defineStore('dialog-store', () => {
  const { push, remove } = useEscapeClose()

  // 帳號相關
  const authDialog = ref(false)

  // 發布帖子
  const _fileSelectDialog = ref(false)
  const _fileSelectDialogKey = '__FILE_SELECT_DIALOG'

  function openFileSelect() {
    _fileSelectDialog.value = true
    push({ key: _fileSelectDialogKey, target: _fileSelectDialog, fn: closeFileSelect })
  }

  function closeFileSelect() {
    _fileSelectDialog.value = false
    remove(_fileSelectDialogKey)
  }

  // 創作者訂閱方案設置
  const subPlanDialog = ref(false)

  // 創作者訂閱方案展示
  const subscriptionDialog = ref(false)

  // 帖子適用的訂閱方案展示
  const feedSubscriptionDialog = ref(false)

  /** 問題反饋 */
  const _feedbackDialog = ref(false)
  const _feedbackDialogKey = '__FEEDBACK_DIALOG'
  function openFeedback() {
    _feedbackDialog.value = true
    push({ key: _feedbackDialogKey, target: _feedbackDialog, fn: closeFeedback })
  }
  function closeFeedback() {
    _feedbackDialog.value = false
    remove(_feedbackDialogKey)
  }

  const paymentDialog = ref(false)
  const paymentDialogKey = '__PAYMENT_DIALOG'
  function openPayment() {
    paymentDialog.value = true
    push({ key: paymentDialogKey, target: paymentDialog, fn: closePayment })
  }
  function closePayment() {
    paymentDialog.value = false
    remove(paymentDialogKey)
  }

  const { lock, unlock } = useRootScrollLock()
  const checkLock = (v) => (v ? lock() : unlock())
  watch(authDialog, checkLock)
  watch(_fileSelectDialog, checkLock)
  watch(subPlanDialog, checkLock)
  watch(subscriptionDialog, checkLock)
  watch(feedSubscriptionDialog, checkLock)
  watch(paymentDialog, checkLock)

  return {
    authDialog,
    fileSelectDialog: readonly(_fileSelectDialog),
    openFileSelect,
    closeFileSelect,

    subPlanDialog,
    subscriptionDialog,
    feedSubscriptionDialog,

    feedbackDialog: readonly(_feedbackDialog),
    openFeedback,
    closeFeedback,

    paymentDialog: readonly(paymentDialog),
    openPayment,
    closePayment,
  }
})
