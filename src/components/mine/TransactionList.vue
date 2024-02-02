<template>
  <div>
    <List :items="dataList" item-key="id">
      <template #default="{ item, last }">
        <div class="space-y-10 pb-20 pt-20 last:border-0 last:pb-0">
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
          <Loading v-if="isLoading">{{ $t('common.loading') }}</Loading>
          <span v-if="noMore">{{ $t('common.noMore') }}</span>
        </div>
      </template>
    </List>
  </div>
</template>
<script setup>
import { onActivated, onDeactivated, onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useHydrationStore } from '@/store/hydration'
import { useMineStore } from '@/store/mine'
import List from '@comp/common/List.vue'
import { onHydration, onServerClientOnce } from '@use/lifecycle'
import { useInfinite } from '@use/request/infinite'

const { dataList, isLoading, noMore, init, next, revert } = useInfinite('Payment.history', {
  params: {},
})

const { mineTransactionList } = storeToRefs(useHydrationStore())
onServerClientOnce(async (isSSR) => {
  await init()
  if (isSSR) mineTransactionList.value = dataList.value
})
onHydration(() => revert(mineTransactionList.value))

const { setNextFn, clearNextFn } = useMineStore()
onMounted(() => setNextFn(next))
onUnmounted(() => clearNextFn(next))
onActivated(() => setNextFn(next))
onDeactivated(() => clearNextFn(next))
</script>
