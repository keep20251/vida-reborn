<template>
  <div class="pt-10">
    <List :items="dataList" item-key="id" divider>
      <template #default="{ item }">
        <div class="space-y-10 pb-10 pt-10 last:pb-0">
          <div class="flex items-center justify-between">
            <div class="text-base font-bold leading-md">{{ $t('info.time') }}</div>
            <div class="text-base font-normal leading-lg text-gray-57">{{ item.created_at }}</div>
          </div>
          <div class="flex items-center justify-between">
            <div class="text-base font-bold leading-md">{{ $t('label.wdrlAmount') }}</div>
            <div class="text-base font-normal leading-md">$ {{ item.amount }}</div>
          </div>
          <div class="flex items-center justify-between">
            <div class="text-base font-bold leading-md">{{ $t('label.status') }}</div>
            <div class="text-base font-normal leading-lg">{{ statusShow(item.status) }}</div>
          </div>
        </div>
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
import { computed, onActivated, onDeactivated, onMounted, onUnmounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMineStore } from '@/store/mine'
import { useInfinite } from '@use/request/infinite'
import { WITHDRAW_LIST_STATUS } from '@/constant/index.js'

const { dataList, isLoading, noMore, init, next } = useInfinite('User.listWithdraw', {
  params: {},
})

const { setNextFn, clearNextFn } = useMineStore()
onMounted(() => init())
onUnmounted(() => clearNextFn(next))
onActivated(() => setNextFn(next))
onDeactivated(() => clearNextFn(next))

const { t: $t } = useI18n()
const statusShow = computed(() => {
  return (status) => {
    switch (status) {
      case WITHDRAW_LIST_STATUS.PAID:
        return $t('info.paid')
      case WITHDRAW_LIST_STATUS.NOT_REVIEWED:
        return $t('info.notReviewed')
      case WITHDRAW_LIST_STATUS.UNDER_REVIEW:
        return $t('info.underReview')
      default:
        return $t('info.reviewFail')
    }
  }
})
</script>
