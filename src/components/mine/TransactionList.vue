<template>
  <div
    v-for="(item, index) in items"
    :key="itemKey ? item[itemKey] : index"
    class="space-y-10 border-b border-gray15 pb-20 pt-20 last:border-0 last:pb-0"
  >
    <div class="flex items-center space-x-5">
      <div class="leading-md text-base font-bold">购买项目:</div>
      <div class="text-base font-normal leading-[1.125rem] text-gray66">{{ item.title }} 订阅</div>
    </div>
    <div class="flex justify-between">
      <div class="flex items-center space-x-5">
        <div class="leading-md text-base font-bold">订单编号:</div>
        <div class="text-base font-normal leading-[1.125rem] text-gray66">{{ item.order }}</div>
      </div>
      <div class="leading-md text-base font-bold">$ {{ item.price }}</div>
    </div>
    <div class="flex justify-between">
      <div class="flex items-center space-x-5">
        <div class="leading-md text-base font-bold">卡号:</div>
        <div class="text-base font-normal leading-[1.125rem] text-gray66">{{ item.card }}</div>
      </div>
      <div class="text-base font-normal leading-[1.125rem] text-gray66">{{ item.date }}</div>
    </div>
  </div>
</template>
<script setup>
defineProps({
  items: { type: Array, require: true },
  itemKey: { type: String },
})
</script>
