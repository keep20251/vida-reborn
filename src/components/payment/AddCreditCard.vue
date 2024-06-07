<template>
  <div class="mb-20 text-center text-sm font-normal leading-lg text-gray-57">
    <AddCard @complete="onSubmitComplte" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { usePaymentStore } from '@/store/payment'
import { useConfirmData } from '@use/modal/confirm-data'
import AddCard from '@/components/payment/embed/AddCard.vue'

const paymentStore = usePaymentStore()
const { getCreditCardList } = paymentStore

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

useConfirmData(async () => {
  isComplete.value = false
  const submitBtn = document.querySelector('#payment-submit-btn')
  submitBtn.click()

  const completeResult = await recallComplete()
  await getCreditCardList()
  if (!submitBtn) return false
  if (!completeResult) return false
})
</script>
