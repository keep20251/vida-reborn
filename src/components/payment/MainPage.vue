<template>
  <DialogHeader :title="$t('payment.title')" :show-back="showBack" @back="closeBack" @close="close">
    <template #default>
      <div class="flex flex-col space-y-10">
        <TagSwiper
          v-model="payway"
          :items="paywayOptions"
          item-label="name"
          item-value="id"
          item-disabled="active"
          :checker="(item) => item.active"
          @click="checkAmount"
        ></TagSwiper>
        <div v-if="paymentError" class="text-sm text-red-500">{{ paymentError }}</div>
        <keep-alive>
          <component
            :is="activeComponent"
            :payment="activeOption"
            :card-add-action="openBack"
            :back="showBack"
            @back:close="closeBack"
            @complete="onSubmitComplte"
          ></component>
        </keep-alive>
      </div>
    </template>
    <template #buttons>
      <div class="flex flex-row space-x-10">
        <Button class="flex-grow" cancel @click="close">{{ $t('common.cancel') }}</Button>
        <Button :loading="isLoading" class="flex-grow" @click="onExecute(confirm)">{{ $t('common.confirm') }}</Button>
      </div>
    </template>
  </DialogHeader>
</template>
<script setup>
import flow from 'lodash/fp/flow'
import partition from 'lodash/fp/partition'
import sortBy from 'lodash/fp/sortBy'
import { computed, onActivated, onDeactivated, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/store/app'
import { useModalStore } from '@/store/modal'
import { usePaymentStore } from '@/store/payment'
import { upperSnackToCamel } from '@/utils/string-helper'
import TagSwiper from '@/components/common/TagSwiper.vue'
import { usePayment } from '@/compositions/payment'
import { useExecutionLock } from '@/compositions/utils/execution-lock'
import { useLocale } from '@/compositions/utils/locale'
import { useWindow } from '@/compositions/utils/window'
import { MODAL_TYPE } from '@/constant'
import { PAYMENT_GROUP, PAYMENT_TYPE } from '@/constant/payment'
import Button from '../common/Button.vue'
import DialogHeader from '../dialog/DialogHeader.vue'
import PopupPayment from './PopupPayment.vue'
import EmbedPayment from './embed/index.vue'

const { t: $t } = useI18n()
const locale = useLocale()

const appStore = useAppStore()
const { appConfig, allPayments } = storeToRefs(appStore)
const { syncAllPaymentConfig } = appStore

const paymentStore = usePaymentStore()
const { close } = paymentStore
const { paymentConfig, defaultCard } = storeToRefs(paymentStore)

const { pay, payStripe, cancel } = usePayment()
const { open } = useModalStore()

const paymentCondition = (groupId) => allPayments.value.find((p) => p.payment_type === groupId)
const activeCondition = (groupId) => {
  const payment = paymentCondition(groupId)
  if (!payment) return false
  return (
    Number(paymentConfig.value.data.amount) >= Number(payment.min_money) &&
    Number(paymentConfig.value.data.amount) <= Number(payment.max_money)
  )
}

const EMBED_STRIPE = 78
const POPUP_STRIPE = 0

const paywayOptions = computed(() => {
  const options = [
    {
      type: PAYMENT_GROUP.CREDIT_CARD,
      componentType: PAYMENT_TYPE.EMBED,
      id: EMBED_STRIPE, // 寫死，內嵌用不上這個 id
      name: $t('payment.payway.creditCard'),
      active: true,
    },
  ]
  const other = {
    type: PAYMENT_GROUP.OTHER,
    componentType: PAYMENT_TYPE.POPUP,
    id: 0,
    name: $t('payment.payway.other'),
    active: true,
  }

  if (appConfig.value.multi_payment_lang.includes(locale.value)) {
    const _arr = []
    Object.entries(PAYMENT_GROUP).forEach(([key, value], index) => {
      const payment = paymentCondition(value)
      if (!payment || payment?.pay_type_id === POPUP_STRIPE) return

      _arr.push({
        type: value,
        componentType: PAYMENT_TYPE.POPUP,
        id: payment?.pay_type_id ?? null,
        name: $t(`payment.payway.${upperSnackToCamel(key)}`),
        active: activeCondition(value),
        sort: index,
      })
    })

    const [activePayments, inactivePayments] = flow(sortBy('sort'), partition('active'))(_arr)
    return options.concat(activePayments, [other], inactivePayments)
  } else {
    options.push(other)
    return options
  }
})

const payway = ref(78)
const activeOption = computed(() => paywayOptions.value.find((option) => option.id === payway.value))
const activeComponent = computed(() =>
  activeOption.value?.componentType === PAYMENT_TYPE.POPUP ? PopupPayment : EmbedPayment,
)

const paymentError = ref('')
function checkAmount(item) {
  if (item.type === PAYMENT_GROUP.CREDIT_CARD || item.type === PAYMENT_GROUP.OTHER) {
    paymentError.value = ''
    return true
  }

  const payment = allPayments.value.find((p) => p.pay_type_id === item.id)
  if (!payment) throw new Error('payment not found')

  if (
    Number(paymentConfig.value.data.amount) > Number(payment.max_money) ||
    Number(paymentConfig.value.data.amount) < Number(payment.min_money)
  ) {
    paymentError.value = $t('payment.error.amountRange', {
      payment: item.name,
      min: payment.min_money,
      max: payment.max_money,
    })
    return false
  }
  paymentError.value = ''
  return true
}

const isComplete = ref(false)
const submitResult = ref(false)
const stripeIntent = ref(null)

function onSubmitComplte({ status, intent }) {
  submitResult.value = status
  intent && (stripeIntent.value = intent)
  isComplete.value = true
}

// 輪詢 isComplete 是否為 true，取決於 CreditCard 組件的 complete 事件，再決定要返回 false 或數據
function recallComplete() {
  return new Promise((resolve) => {
    const interval = setInterval(() => {
      if (isComplete.value) {
        clearInterval(interval)
        resolve(submitResult.value)
      }
    }, 500)
  }).then((r) => (r ? { intent: stripeIntent.value } : false))
}

const { disabled: isLoading, onExecute } = useExecutionLock()

const isCardList = computed(
  () => activeOption.value.type === PAYMENT_GROUP.CREDIT_CARD && defaultCard.value && !showBack.value,
)
const isAddCard = computed(() => activeOption.value.type === PAYMENT_GROUP.CREDIT_CARD || showBack.value)

async function confirm() {
  if (isCardList.value) {
    console.log('payment with default card')

    paying()

    const payload = {
      item_id: paymentConfig.value.data.item_id,
      type: paymentConfig.value.paymentType,
      user_payment_method_id: defaultCard.value.id,
    }

    await payStripe({
      ...paymentConfig.value,
      data: payload,
    })
  } else if (isAddCard.value) {
    console.log('payment with new card')

    isComplete.value = false
    const submitBtn = document.querySelector('#payment-submit-btn')
    if (!submitBtn) throw new Error('Payment dialog confirm error: Can not find submit button')
    submitBtn.click()

    const completeResult = await recallComplete()
    if (!completeResult) return

    paying()

    const payload = {
      item_id: paymentConfig.value.data.item_id,
      type: paymentConfig.value.paymentType,
      user_payment_method_id: completeResult.intent.payment_method,
    }

    await payStripe({
      ...paymentConfig.value,
      data: payload,
    })
  } else {
    paying()
    const { openWindow } = useWindow()
    const window = openWindow()

    const payload = {
      item_id: paymentConfig.value.data.item_id,
      pay_type_id: payway.value,
    }

    await pay({
      ...paymentConfig.value,
      newWindow: window,
      data: payload,
    })
  }
}

function paying() {
  open(MODAL_TYPE.PAYING, {
    title: 'modal.paying.title',
    size: 'sm',
    confirmText: $t('common.cancel'),
    confirmAction: () => cancel(),
  })
}

const showBack = ref(false)
const openBack = () => (showBack.value = true)
const closeBack = () => (showBack.value = false)

onActivated(async () => await syncAllPaymentConfig())
onDeactivated(() => {
  payway.value = EMBED_STRIPE
  paymentError.value = ''
})
</script>
