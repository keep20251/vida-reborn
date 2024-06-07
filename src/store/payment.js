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
  const defaultCard = ref({})

  const { execute: cardList } = useRequest('Payment.getCardList')
  async function getCreditCardList() {
    try {
      const response = await cardList({})
      console.log('信用卡列表有東西嗎?', response)
      creditCardList.value = response
      defaultCard.value = creditCardList.value.find((card) => card.is_default) || creditCardList.value[0]
      console.log('defaultCard的卡片內容為：', defaultCard.value)
    } catch (e) {
      console.error(e)
    }
  }

  const { execute: delCard } = useRequest('Payment.deleteCard')
  async function onDelCard(card) {
    try {
      const data = { payment_method_id: card.id }
      await delCard(data)
      console.log('你刪除的是哪個:', card.id)
      await getCreditCardList()
    } catch (e) {
      console.error(e)
    }
  }

  const { execute: bindDefaultCard } = useRequest('Payment.bindDefaultCard')
  async function onBindDefaultCard(card) {
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
    onDelCard,
    defaultCard,
    onBindDefaultCard,
  }
})
