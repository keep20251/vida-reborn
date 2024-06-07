<template>
  <div class="flex flex-col space-y-10">
    <div class="text-base font-normal leading-md">
      {{ $t('info.cardLimit', { length: creditCardList ? creditCardList.length : 0, max: maxCardCount }) }}
    </div>
    <div v-for="(card, index) in creditCardList" :key="`card-container-${index}`">
      <Card
        :brand="card.card.brand"
        :last4="card.card.last4"
        :selected="card.id === defaultCard"
        :defaultable="card.id !== defaultCard"
        removable
        @crad:set-default="defaultCard = card.id"
        @card:remove="onCardRemoved(card)"
      ></Card>
    </div>
    <Button @click="onCardAdd">{{ $t('common.addCard') }}</Button>
    <div @click="getCreditCardList">點我跑出卡</div>
  </div>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useModalStore } from '@/store/modal'
import { usePaymentStore } from '@/store/payment'
import { MODAL_TYPE } from '@const/index'
import Button from '@/components/common/Button.vue'
import Card from '@/components/payment/Card.vue'

const { t: $t } = useI18n()
const { confirm, alert, open } = useModalStore()
const paymentStore = usePaymentStore()
const { getCreditCardList, onDelCard, onBindDefaultCard } = paymentStore
const { creditCardList, defaultCard } = storeToRefs(paymentStore)
onMounted(() => getCreditCardList())

// TODO 這裡應該要封裝到 payment store 裡，包括獲取卡片列表、刪除卡片、設定預設卡片等
// const defaultCard = ref(0)
// const cards = ref([
//   { id: 1, brand: 'Visa', last4: '1234' },
//   { id: 2, brand: 'MasterCard', last4: '5678' },
//   { id: 3, brand: 'JCB', last4: '9012' },
//   { id: 4, brand: 'American Express', last4: '3456' },
// { id: 5, brand: 'UnionPay', last4: '7890' },
// ])

const maxCardCount = 5
function onCardRemoved(card) {
  confirm({
    size: 'sm',
    title: $t('modal.delete.title'),
    content: $t('modal.delete.content'),
    confirmAction: () => removeCard(card),
    confirmText: $t('common.confirm'),
    cancelText: $t('common.cancel'),
  })
}

function removeCard(card) {
  const index = creditCardList.value.findIndex((c) => c.id === card.id)
  if (defaultCard.value === card.id) {
    const nextDefault = creditCardList.value[(index + 1) % creditCardList.value.length]
    defaultCard.value = nextDefault.id
    // TODO 這裡應該會有一個 API 去設定預設卡片
  }
  creditCardList.value.splice(index, 1)
  // TODO 這裡應該會有一個 API 去刪除卡片
  onDelCard(card)
}

function onCardAdd() {
  if (creditCardList.value.length >= maxCardCount) {
    alert({
      title: $t('modal.cardLimit.title'),
      content: $t('modal.cardLimit.content'),
    })
  } else {
    open(MODAL_TYPE.ADD_CREDIT_CARD, {
      title: '新增信用卡',
      size: 'sm',
      confirmAction: (data) => {
        console.log('哈嚕嚕', data)
      },
      cancelAction: () => {},
    })
    console.log('add card')
  }
}
</script>
