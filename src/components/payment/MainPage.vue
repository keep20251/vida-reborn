<template>
  <DialogHeader title="支付選項" :show-back="showBack" @back="closeBack">
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
        <Button class="flex-grow" @click="confirm">{{ $t('common.confirm') }}</Button>
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
import { usePaymentStore } from '@/store/payment'
import { upperSnackToCamel } from '@/utils/string-helper'
import TagSwiper from '@/components/common/TagSwiper.vue'
import { useLocale } from '@/compositions/utils/locale'
import { useWindow } from '@/compositions/utils/window'
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
const { amount } = storeToRefs(paymentStore)

const paymentCondition = (groupId) => allPayments.value.find((p) => p.payment_type === groupId)
const activeCondition = (groupId) => {
  const payment = paymentCondition(groupId)
  if (!payment) return false
  return amount.value >= Number(payment.min_money) && amount.value <= Number(payment.max_money)
}

const STATIC_EMBED_PAYWAY = 78
const paywayOptions = computed(() => {
  const options = [
    {
      type: PAYMENT_GROUP.CREDIT_CARD,
      componentType: PAYMENT_TYPE.EMBED,
      id: STATIC_EMBED_PAYWAY, // 寫死，內嵌用不上這個 id
      name: $t('payment.payway.creditCard'),
      active: true,
    },
  ]
  const other = {
    type: PAYMENT_GROUP.OTHER,
    componentType: PAYMENT_TYPE.POPUP,
    id: 0,
    name: $t('payment.payway.other'),
    // TODO 後端還沒好，先設定 false
    active: false,
  }

  if (appConfig.value.multi_payment_lang.includes(locale.value)) {
    const _arr = []
    Object.entries(PAYMENT_GROUP).forEach(([key, value], index) => {
      const payment = paymentCondition(value)
      if (!payment) return

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

  if (amount.value > payment.max_money || amount.value < payment.min_money) {
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

async function confirm() {
  if (activeOption.value.type === PAYMENT_GROUP.CREDIT_CARD) {
    isComplete.value = false
    const submitBtn = document.querySelector('#payment-submit-btn')
    if (!submitBtn) throw new Error('Payment dialog confirm error: Can not find submit button')
    submitBtn.click()
    const completeResult = await recallComplete()
    if (!completeResult) return
    console.log('confirm', completeResult)
  } else {
    // TODO 彈出其他支付方式的窗口
    const { openWindow } = useWindow()
    openWindow()
    console.log('confirm')
  }
}

const showBack = ref(false)
const openBack = () => (showBack.value = true)
const closeBack = () => (showBack.value = false)

onActivated(async () => {
  await syncAllPaymentConfig()
  console.log('onActivated appConfig', { appConfig: appConfig.value })
})

onDeactivated(() => {
  payway.value = STATIC_EMBED_PAYWAY
  paymentError.value = ''
  console.log('onDeactivated appConfig', { appConfig: appConfig.value })
})
</script>
