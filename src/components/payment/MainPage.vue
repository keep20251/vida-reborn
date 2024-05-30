<template>
  <DialogHeader title="支付選項">
    <div class="flex flex-col space-y-10">
      <TagSwiper v-model="payway" :items="paymentOptions" item-label="name" item-value="id"></TagSwiper>
      <keep-alive>
        <component :is="activeComponent" :payment="activeOption"></component>
      </keep-alive>
    </div>
  </DialogHeader>
</template>
<script setup>
import { computed, ref } from 'vue'
import TagSwiper from '@/components/common/TagSwiper.vue'
import { PAYMENT_GROUP, PAYMENT_TYPE } from '@/constant/payment'
import DialogHeader from '../dialog/DialogHeader.vue'
import PopupPayment from './PopupPayment.vue'
import EmbedPayment from './embed/index.vue'

const payway = ref(PAYMENT_GROUP.CREDIT_CARD)
const paymentOptions = [
  { name: '銀行卡', id: PAYMENT_GROUP.CREDIT_CARD, type: PAYMENT_TYPE.EMBED },
  { name: '支付寶', id: PAYMENT_GROUP.ALI_PAY, type: PAYMENT_TYPE.POPUP },
  { name: '銀聯卡', id: PAYMENT_GROUP.UNION_PAY, type: PAYMENT_TYPE.POPUP },
]
const activeOption = computed(() => paymentOptions.find((option) => option.id === payway.value))
const activeComponent = computed(() => (activeOption.value?.type === PAYMENT_TYPE.POPUP ? PopupPayment : EmbedPayment))
</script>
