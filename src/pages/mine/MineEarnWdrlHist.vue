<template>
  <div class="pt-10">
    <List :items="items" item-key="id">
      <template #default="{ item, last }">
        <div :key="itemKey ? item[itemKey] : index" class="space-y-10 pb-10 pt-10 last:pb-0">
          <div class="flex justify-between">
            <div class="flex items-center space-x-5">
              <div class="text-base font-bold leading-md">{{ $t('label.cardNumber') }}:</div>
              <div class="text-gray-57 text-base font-normal leading-lg">{{ item.card }}</div>
            </div>
            <div class="text-base font-bold leading-md">$ {{ item.price }}</div>
          </div>
          <div class="flex justify-between">
            <div class="flex items-center space-x-5">
              <div class="text-base font-bold leading-md">提領方式:</div>
              <div class="text-gray-57 text-base font-normal leading-lg">{{ item.cardType }}</div>
            </div>
            <div class="flex items-center space-x-5">
              <div class="text-base font-bold leading-md">狀態:</div>
              <div class="text-gray-57 text-base font-normal leading-lg">{{ item.status }}</div>
            </div>
          </div>
          <div class="flex items-center justify-end space-x-5">
            <div class="text-gray-57 text-base font-normal leading-lg">{{ item.date }}</div>
          </div>
        </div>
        <div v-if="!last" class="h-1 bg-black opacity-[0.15]"></div>
      </template>
    </List>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import List from '@comp/common/List.vue'

const items = ref([
  {
    cardType: '銀行卡',
    price: 1500,
    card: '1234********1234',
    date: '2024-01-01',
    status: '待審核',
  },
  {
    cardType: '銀行卡',
    price: 12353,
    card: '1234********1234',
    date: '2024-01-04',
    status: '待審核',
  },

  {
    cardType: '銀行卡',
    price: 12353,
    card: '1234********1234',
    date: '2024-01-04',
    status: '待審核',
  },
])
</script>
