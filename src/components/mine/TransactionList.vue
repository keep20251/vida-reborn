<template>
  <div>
    <List :items="items" item-key="id">
      <template #default="{ item, last }">
        <div :key="itemKey ? item[itemKey] : index" class="space-y-10 pb-20 pt-20 last:border-0 last:pb-0">
          <div class="flex items-center space-x-5">
            <div class="text-base font-bold leading-md">{{ $t('label.purItems') }}:</div>
            <div class="text-base font-normal leading-lg text-gray-57">{{ item.item_name }} {{ $t('label.subs') }}</div>
          </div>
          <div class="flex justify-between">
            <div class="flex items-center space-x-5">
              <div class="text-base font-bold leading-md">{{ $t('label.orderNumber') }}:</div>
              <div class="text-base font-normal leading-lg text-gray-57">{{ item.order_id }}</div>
            </div>
            <div class="text-base font-bold leading-md">$ {{ item.pay_amount }}</div>
          </div>
          <div class="flex justify-between">
            <div class="flex items-center space-x-5">
              <div class="text-base font-bold leading-md">{{ $t('label.cardNumber') }}:</div>
              <div class="text-base font-normal leading-lg text-gray-57">{{ item.order_type }}</div>
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

// import useRequest from '@use/request/index.js'

// const items = ref(null)

// onMounted(() => {
//   transactionList()
// })

// let data
// const transactionList = async () => {
//   const { execute } = useRequest('Payment.history')
//   try {
//     data = await execute({
//       page: 1,
//       limit: 10,
//     })
//     console.log('這個是data', data)
//     items.value = data.list
//     console.log('看一下data有沒有等於items', items.value)
//   } catch (e) {
//     console.error(e)
//   }
// }

const items = ref([
  {
    item_name: 'Cursed_ellie',
    order_id: '341511',
    pay_amount: 1500,
    order_type: '信用卡',
    created_at: '2024-01-01',
  },
  {
    item_name: 'Cursed_ellie',
    order_id: '341512',
    pay_amount: 1234,
    order_type: '信用卡',
    created_at: '2024-01-02',
  },
  {
    item_name: 'Cursed_ellie',
    order_id: '341513',
    pay_amount: 12353,
    order_type: '信用卡',
    created_at: '2024-01-04',
  },
])
</script>
