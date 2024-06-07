<template>
  <div class="flex flex-col space-y-10">
    <Card v-if="card" :brand="card?.brand" :last4="card?.last4"></Card>
    <BaseOutline>
      <template #default>
        <div @click="$emit('add:card')">
          <div class="text-sm text-gray-a3">{{ $t('payment.cardList.add') }}</div>
          <div class="absolute right-8 top-8">
            <Icon name="dropdown" class="rotate-90" size="20"></Icon>
          </div>
        </div>
      </template>
    </BaseOutline>
  </div>
</template>
<script setup>
import BaseOutline from '@/components/common/BaseOutline.vue'
import Card from '@/components/payment/Card.vue'

defineEmits(['add:card'])
const props = defineProps({ card: Object })
</script>
