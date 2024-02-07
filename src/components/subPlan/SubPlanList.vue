<template>
  <div class="select-none">
    <div @click="subPlanAdd(lg)" class="text-center text-gray-57 pb-15 font-bold text-base leading-md cursor-pointer">
      ＋ 点击新增订阅组
    </div>
    <div class="overflow-y-scroll scrollbar-md max-h-[60vh] pr-15">
      <List :items="dataList" item-key="id" divider>
        <template #default="{ item, index }">
          <div class="grid space-y-15 py-15">
            <div class="grid space-y-10">
              <div class="flex justify-between">
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
</template>

<script setup>
import { onActivated, onDeactivated, onMounted, onUnmounted } from 'vue'
import { useMineStore } from '@/store/mine'
import { useModalStore } from '@/store/modal'
import Button from '@comp/common/Button.vue'
import List from '@comp/common/List.vue'
import { useInfinite } from '@use/request/infinite'
import { MODAL_TYPE } from '@const'

const modalStore = useModalStore()
const { open } = modalStore

function subPlanAdd(size) {
  open(MODAL_TYPE.SUB_PLAN_SET, {
    size,
    title: '新增訂閱方案',
    showClose: true,
    showConfirm: false,
  })
}

function subPlanEdit(dataList, index) {
  open(MODAL_TYPE.SUB_PLAN_SET, {
    title: '編輯訂閱方案',
    showClose: true,
    showConfirm: false,
  })
}

const { dataList, isLoading, noMore, init, next, revert } = useInfinite('Subscription.list', {
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
</script>
