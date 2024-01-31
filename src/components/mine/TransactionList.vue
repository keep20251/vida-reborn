<template>
  <div>
    <List :items="items" item-key="id">
      <template #default="{ item, last }">
        <div :key="itemKey ? item[itemKey] : index" class="space-y-10 pb-20 pt-20 last:border-0 last:pb-0">
          <div class="flex justify-between">
            <div class="flex items-center space-x-5">
              <div class="text-base font-bold leading-md">{{ $t('label.purItems') }}:</div>
              <div class="text-base font-normal leading-lg text-gray-57">
                {{ item.item_name }} {{ $t('label.subs') }}
              </div>
            </div>
            <div class="text-base font-bold leading-md">$ {{ item.pay_amount }}</div>
          </div>
          <div class="flex justify-between">
            <div class="flex items-center space-x-5">
              <div class="text-base font-bold leading-md">{{ $t('label.orderNumber') }}:</div>
              <div class="text-base font-normal leading-lg text-gray-57">{{ item.order_id }}</div>
            </div>
            <div class="text-base font-normal leading-lg text-gray-57">{{ item.created_at }}</div>
          </div>
        </div>
        <div v-if="!last" class="h-1 bg-black opacity-[0.15]"></div>
      </template>
      <template #bottom>
        <div class="flex items-center justify-center py-20 text-gray-a3">
          <Loading></Loading>{{ $t('common.noMore') }}
        </div>
      </template>
    </List>
  </div>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import List from '@comp/common/List.vue'
import useRequest from '@use/request/index.js'

const items = ref(null)

onMounted(() => {
  transactionList()
})

let data
const transactionList = async () => {
  const { execute } = useRequest('Payment.history')
  try {
    data = await execute({
      page: 1,
      limit: 10,
    })
    items.value = data.list
  } catch (e) {
    console.error(e)
  }
}
</script>
