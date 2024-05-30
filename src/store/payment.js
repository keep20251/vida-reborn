import { computed } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import MainPage from '@/components/payment/MainPage.vue'
import { useHistory } from '@/compositions/routers/history'
import { PAYMENT_ROUTES } from '@/constant'
import { useDialogStore } from './dialog'

export const usePaymentStore = defineStore('payment-store', () => {
  const dialogStore = useDialogStore()
  const { paymentDialog } = storeToRefs(dialogStore)
  const { openPayment, closePayment } = dialogStore

  const isOpen = computed(() => paymentDialog.value)
  function open() {
    console.log('payment dialog is open')
    openPayment()
  }
  function close() {
    closePayment()
  }

  const routes = [{ value: PAYMENT_ROUTES.MAIN_PAGE, component: MainPage }]
  const { now, goto, back } = useHistory({ initValue: PAYMENT_ROUTES.MAIN_PAGE })
  const activeComponent = computed(() => routes.find((route) => route.value === now.value)?.component)

  return {
    isOpen,
    activeComponent,
    open,
    close,
    goto,
    back,
  }
})
