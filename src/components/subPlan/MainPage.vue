<template>
  <div class="flex h-full w-full flex-col">
    <div class="bg-primary text-white relative text-center py-15 px-20 rounded-t-xl">
      <div class="text-lg font-bold leading-5">訂閱設定</div>
      <button @click="close" class="absolute right-0 pr-20 top-1/3">
        <Icon name="closeWhite"></Icon>
      </button>
    </div>
    <div class="px-30 py-20 select-none">
      <div @click="subPlanAdd()" class="text-center text-gray-57 pb-15 font-bold text-base leading-md cursor-pointer">
        ＋ 点击新增订阅组
      </div>
      <div class="overflow-y-scroll scrollbar-md pr-15 max-h-[75vh]">
        <List :items="dataList" item-key="id" divider>
          <template #default="{ item, index }">
            <div class="grid space-y-15 py-15">
              <div class="grid space-y-10">
                <div class="flex justify-between items-end">
                  <div class="flex items-end flex-row">
                    <div class="font-bold text-xl leading-xl pr-4">${{ item.price }}</div>
                    <div class="text-base leading-lg font-normal">/ {{ item.expire_days }}</div>
                  </div>
                  <div class="text-subscribe-orange font-bold text-base leading-md">{{ item.name }}</div>
                </div>
                <EncryptImage :src="item.picture" cover :borderRadius="10" :height="260"></EncryptImage>
                <div class="text-sm text-gray-57 leading-md">{{ item.content }}</div>
              </div>
              <Button @click="subPlanEdit(dataList, index)" gradient>編輯</Button>
            </div>
          </template>
          <template #bottom>
            <div class="flex items-center justify-center text-gray-a3">
              <Loading v-if="isLoading">{{ $t('common.loading') }}</Loading>
              <span v-if="noMore">{{ $t('common.noMore') }}</span>
            </div>
          </template>
        </List>
      </div>
    </div>
  </div>
</template>
<script setup>
import { onActivated, onDeactivated, onMounted, onUnmounted } from 'vue'
import { useMineStore } from '@/store/mine'
import { useSubPlanStore } from '@/store/sub-plan'
import Button from '@comp/common/Button.vue'
import List from '@comp/common/List.vue'
import { useInfinite } from '@use/request/infinite'
import { SUB_PLAN } from '@const'

const { dataList, isLoading, noMore, init, next } = useInfinite('Subscription.list', {
  params: {},
})
const { setNextFn, clearNextFn } = useMineStore()
onMounted(() => {
  init()
  setNextFn(next)
})
onUnmounted(() => clearNextFn(next))
onActivated(() => {
  init()
  setNextFn(next)
})
onDeactivated(() => clearNextFn(next))

const { to, close } = useSubPlanStore()
function subPlanAdd() {
  to(SUB_PLAN.SET)
}
</script>
