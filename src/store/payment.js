import { computed, readonly, ref } from 'vue'
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

  const routes = [{ value: PAYMENT_ROUTES.MAIN_PAGE, component: MainPage }]
  const { now, goto, back, init } = useHistory({ initValue: PAYMENT_ROUTES.MAIN_PAGE })
  const activeComponent = computed(() => routes.find((route) => route.value === now.value)?.component)

  const _amount = ref(null)
  const amount = computed(() => Number(_amount.value))

  const _paymentConfig = ref(null)

  function open({ route = PAYMENT_ROUTES.MAIN_PAGE, amount, paymentConfig }) {
    _amount.value = amount
    _paymentConfig.value = paymentConfig
    console.log('payment dialog is open')
    init(route)
    openPayment()
  }
  function close() {
    closePayment()
    init(PAYMENT_ROUTES.MAIN_PAGE)
    _paymentConfig.value = null
    _amount.value = null
  }

  return {
    isOpen,
    activeComponent,
    amount: readonly(amount),
    paymentConfig: readonly(_paymentConfig),
    open,
    close,
    goto,
    back,
  }
})
