<template>
  <div
    v-for="(item, index) in items"
    :key="itemKey ? item[itemKey] : index"
    class="border-gray-e5 space-y-10 border-b pb-20 pt-20 last:border-0 last:pb-0"
  >
    <div class="flex items-center space-x-5">
      <div class="text-base font-bold leading-md">{{ $t('label.purItems') }}:</div>
      <div class="text-gray-57 text-base font-normal leading-lg">{{ item.title }} {{ $t('label.subs') }}</div>
    </div>
    <div class="flex justify-between">
      <div class="flex items-center space-x-5">
        <div class="text-base font-bold leading-md">{{ $t('label.orderNumber') }}:</div>
        <div class="text-gray-57 text-base font-normal leading-lg">{{ item.order }}</div>
      </div>
      <div class="text-base font-bold leading-md">$ {{ item.price }}</div>
    </div>
    <div class="flex justify-between">
      <div class="flex items-center space-x-5">
        <div class="text-base font-bold leading-md">{{ $t('label.cardNumber') }}:</div>
        <div class="text-gray-57 text-base font-normal leading-lg">{{ item.card }}</div>
      </div>
      <div class="text-gray-57 text-base font-normal leading-lg">{{ item.date }}</div>
    </div>
  </div>
</template>
<script setup>
defineProps({
  items: { type: Array, require: true },
  itemKey: { type: String },
})
</script>
