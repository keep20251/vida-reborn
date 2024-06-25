<template>
  <div class="pt-10">
    <List :items="dataList" item-key="id" divider>
      <template #default="{ item }">
        <div class="space-y-10 pb-10 pt-10 last:pb-0">
          <div class="flex items-center justify-between">
            <div class="text-base font-bold leading-md">{{ $t('info.time') }}</div>
            <div class="text-base font-normal leading-lg text-gray-57">
              {{ tsSecondToYMDhm(item.created_ts, item.created_at) }}
            </div>
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
        <NoData v-if="noData" :reload="reload"></NoData>
        <div v-else class="flex items-center justify-center py-8 text-gray-a3">
          <Loading v-if="isLoading">{{ $t('common.loading') }}</Loading>
          <span v-if="noMore">{{ $t('common.noMore') }}</span>
        </div>
      </template>
    </List>
  </div>
</template>
<script setup>
import { computed, onActivated, onDeactivated, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMineStore } from '@/store/mine'
import NoData from '@comp/info/NoData.vue'
import { useInfinite } from '@use/request/infinite'
import { tsSecondToYMDhm } from '@/utils/string-helper'
import { WITHDRAW_LIST_STATUS } from '@/constant/index.js'

const { dataList, isLoading, noMore, noData, init, next, reload } = useInfinite('User.listWithdraw', {
  params: {},
})

const { setNextFn, clearNextFn, setReloadFn, clearReloadFn } = useMineStore()
onMounted(() => init())
onUnmounted(() => {
  clearNextFn(next)
  clearReloadFn()
})
onActivated(() => {
  setNextFn(next)
  setReloadFn(reload)
})
onDeactivated(() => {
  clearNextFn(next)
  clearReloadFn()
})

const { t: $t } = useI18n()
const statusShow = computed(() => {
  return (status) => {
    switch (status) {
      case WITHDRAW_LIST_STATUS.PENDING:
        return $t('info.pending')
      case WITHDRAW_LIST_STATUS.PASS:
        return $t('info.passed')
      case WITHDRAW_LIST_STATUS.WDRL_COM:
        return $t('info.wdrlCom')
      default:
        return $t('info.wdrlFlr')
    }
  }
})
</script>
