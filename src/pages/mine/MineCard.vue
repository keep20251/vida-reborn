<template>
  <div class="flex flex-col space-y-10">
    <div class="text-base font-normal leading-md">
      {{ $t('info.cardLimit', { length: creditCardList ? creditCardList.length : 0, max: maxCardCount }) }}
    </div>
    <div v-for="(card, index) in creditCardList" :key="`card-container-${index}`">
      <Card
        :brand="card.card.brand"
        :last4="card.card.last4"
        :selected="card.id === defaultCard.id"
        :defaultable="card.id !== defaultCard.id"
        removable
        @card:set-default="onBindDefaultCard(card)"
        @card:remove="onCardRemoved(card)"
      ></Card>
    </div>
    <Button @click="onCardAdd">{{ $t('common.addCard') }}</Button>
  </div>
</template>
<script setup>
import { onMounted } from 'vue'
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
  if (defaultCard.value.id === card.id) {
    const nextDefault = creditCardList.value[(index + 1) % creditCardList.value.length]
    defaultCard.value.id = nextDefault.id
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
      title: 'common.addCard',
      size: 'sm',
      confirmAction: (data) => {
        console.log(data)
      },
      cancelAction: () => {},
    })
    console.log('add card')
  }
}
</script>
