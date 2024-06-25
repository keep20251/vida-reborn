<template>
  <div class="flex flex-col space-y-10">
    <div v-if="cards.length > 0" class="flex flex-col space-y-10">
      <Card
        v-for="(paymentCard, index) in cards"
        :key="`payment-credit-card-${index}`"
        :defaulted="paymentCard.id === modelValue.id"
        :selected="paymentCard.id === modelValue.id"
        :brand="paymentCard.card?.brand"
        :last4="paymentCard.card?.last4"
        :disabled="paymentCard.is_ban"
        @click="onCardClicked(paymentCard)"
      ></Card>
    </div>

    <BaseOutline @click="$emit('add:card')">
      <template #default>
        <div class="text-sm text-gray-a3">{{ $t('payment.cardList.add') }}</div>
        <div class="absolute right-8 top-8">
          <Icon name="dropdown" class="-rotate-90" size="20"></Icon>
        </div>
      </template>
    </BaseOutline>
  </div>
</template>
<script setup>
import { computed } from 'vue'
import BaseOutline from '@/components/common/BaseOutline.vue'
import Card from '@/components/payment/Card.vue'

const props = defineProps({
  modelValue: { type: Object, required: true },
  cards: { type: Array, required: true },
})

const emit = defineEmits(['add:card', 'update:modelValue'])

const modelValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const onCardClicked = (card) => (card.is_ban ? void 0 : (modelValue.value = card))
</script>
