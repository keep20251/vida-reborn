<template>
  <div class="flex flex-col space-y-10">
    <div class="flex flex-row space-x-10">
      <img v-if="currentPayment.img" :src="currentPayment.img" alt="" />
      <div class="flex items-center text-base font-normal leading-md">{{ $t(currentPayment.title) }}</div>
    </div>
    <div class="text-xs font-medium leading-3 text-gray-57">{{ $t('payment.popup.info') }}</div>
  </div>
</template>
<script setup>
import { computed } from 'vue'
import AliPayImg from '@/assets/images/payment/payway/ali-pay.png'
import UnionPayImg from '@/assets/images/payment/payway/union-pay.png'
import { PAYMENT_GROUP } from '@/constant/payment'

const props = defineProps({
  payment: { type: Object, required: true },
})

const paymentMap = {
  [PAYMENT_GROUP.ALI_PAY]: { img: AliPayImg, title: 'payment.popup.ali.title' },
  [PAYMENT_GROUP.UNION_PAY]: { img: UnionPayImg, title: 'payment.popup.union.title' },
  [PAYMENT_GROUP.OTHER]: { img: null, title: 'payment.popup.other.title' },
}

const currentPayment = computed(() => paymentMap[props.payment.type])
</script>
