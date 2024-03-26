<template>
  <div class="space-y-10 pb-20 pt-20 last:border-0 last:pb-0">
    <div class="flex justify-between">
      <div class="flex w-9/12 items-center space-x-5">
        <div class="whitespace-nowrap text-base font-bold leading-md">{{ $t('label.purItems') }}:</div>
        <div class="text-base font-normal leading-lg text-gray-57">{{ item.item_name }} {{ $t('label.subs') }}</div>
      </div>
      <div class="w-2/12 text-right text-base font-bold leading-md">$ {{ item.pay_amount }}</div>
    </div>
    <div class="flex items-baseline justify-between space-x-10">
      <div class="flex w-9/12 items-center space-x-5">
        <div class="whitespace-nowrap text-base font-bold leading-md">{{ $t('label.orderNumber') }}:</div>
        <div class="text-base font-normal leading-lg text-gray-57">{{ item.order_id }}</div>
      </div>
      <div class="w-3/12 flex-wrap text-right text-base font-normal leading-lg text-gray-57">
        {{ tsSecondToYMDhm(item.created_ts, item.created_at) }}
      </div>
    </div>
  </div>
</template>
<script setup>
import { tsSecondToYMDhm } from '@/utils/string-helper'

defineProps({
  item: { type: Object, required: true },
})
</script>
