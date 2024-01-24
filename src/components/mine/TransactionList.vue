<template>
  <div
    v-for="(item, index) in items"
    :key="itemKey ? item[itemKey] : index"
    class="border-gray15 space-y-10 border-b pb-20 pt-20 last:border-0 last:pb-0"
  >
    <div class="flex items-center space-x-5">
      <div class="leading-md text-base font-bold">{{ $t('label.purItems') }}:</div>
      <div class="leading-lg text-base font-normal text-gray66">{{ item.title }} {{ $t('label.subs') }}</div>
    </div>
    <div class="flex justify-between">
      <div class="flex items-center space-x-5">
        <div class="leading-md text-base font-bold">{{ $t('label.orderNumber') }}:</div>
        <div class="leading-lg text-base font-normal text-gray66">{{ item.order }}</div>
      </div>
      <div class="leading-md text-base font-bold">$ {{ item.price }}</div>
    </div>
    <div class="flex justify-between">
      <div class="flex items-center space-x-5">
        <div class="leading-md text-base font-bold">{{ $t('label.cardNumber') }}:</div>
        <div class="leading-lg text-base font-normal text-gray66">{{ item.card }}</div>
      </div>
      <div class="leading-lg text-base font-normal text-gray66">{{ item.date }}</div>
    </div>
  </div>
</template>
<script setup>
defineProps({
  items: { type: Array, require: true },
  itemKey: { type: String },
})
</script>
