<template>
  <div class="flex flex-col space-y-10">
    <div class="text-base font-normal leading-md">
      {{ $t('info.cardLimit', { length: cards.length, max: maxCardCount }) }}
    </div>
    <div v-for="(card, index) in cards" :key="`card-container-${index}`">
      <Card
        :brand="card.brand"
        :last4="card.last4"
        :selected="card.id === activeCardId"
        :defaultable="card.id !== activeCardId"
        removable
        @crad:set-default="activeCardId = card.id"
        @card:remove="onCardRemoved(card)"
      ></Card>
    </div>
    <Button @click="onCardAdd">{{ $t('common.addCard') }}</Button>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useModalStore } from '@/store/modal'
import Button from '@/components/common/Button.vue'
import Card from '@/components/payment/Card.vue'

const { t: $t } = useI18n()
const { confirm, alert } = useModalStore()

// TODO 這裡應該要封裝到 payment store 裡，包括獲取卡片列表、刪除卡片、設定預設卡片等
const activeCardId = ref(1)
const cards = ref([
  { id: 1, brand: 'Visa', last4: '1234' },
  { id: 2, brand: 'MasterCard', last4: '5678' },
  { id: 3, brand: 'JCB', last4: '9012' },
  { id: 4, brand: 'American Express', last4: '3456' },
  { id: 5, brand: 'UnionPay', last4: '7890' },
])

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
  const index = cards.value.findIndex((c) => c.id === card.id)
  if (activeCardId.value === card.id) {
    const nextDefault = cards.value[(index + 1) % cards.value.length]
    activeCardId.value = nextDefault.id
    // TODO 這裡應該會有一個 API 去設定預設卡片
  }
  cards.value.splice(index, 1)
  // TODO 這裡應該會有一個 API 去刪除卡片
}

function onCardAdd() {
  if (cards.value.length >= maxCardCount) {
    alert({
      title: $t('modal.cardLimit.title'),
      content: $t('modal.cardLimit.content'),
    })
  } else {
    console.log('add card')
  }
}
</script>
