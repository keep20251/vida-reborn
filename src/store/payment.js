import { computed, readonly, ref } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import useRequest from '@use/request'
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

  const creditCardList = ref([])
  const defaultCard = ref(null)

  const currentCard = ref(null) // 當前選擇的信用卡

  const { execute: getCardList } = useRequest('Payment.getCardList')
  async function getCreditCardList() {
    try {
      const response = await getCardList({})
      if (!response) return
      creditCardList.value = response

      const _card = creditCardList.value.find((card) => card.is_default) || creditCardList.value[0]
      defaultCard.value = _card
      currentCard.value = _card
    } catch (e) {
      console.error(e)
    }
  }

  const { execute: deleteCard } = useRequest('Payment.deleteCard')
  async function onDelCard(card) {
    try {
      const data = { payment_method_id: card.id }
      await deleteCard(data)
      await getCreditCardList()
    } catch (e) {
      console.error(e)
    }
  }

  const { execute: bindDefaultCard } = useRequest('Payment.bindDefaultCard')
  async function onBindDefaultCard(card) {
    if (card.is_ban) {
      console.log('Card is banned, cannot set as default card')
      return
    }
    defaultCard.value.id = card.id
    try {
      console.log(`預設信用卡: ${card.id}`)
      await bindDefaultCard({ payment_method_id: card.id })
      await getCreditCardList()
    } catch (e) {
      console.error(e)
    }
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

    creditCardList,
    getCreditCardList,

    defaultCard,
    onDelCard,
    onBindDefaultCard,

    currentCard,
  }
})
