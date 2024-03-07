<template>
  <div class="flex items-end justify-between pt-8">
    <div class="text-base font-bold leading-md">{{ $t('content.currentEarn') }}</div>
    <router-link :to="{ name: 'mine-earn-wdrl-hist' }">
      <div class="text-base font-normal leading-md">{{ $t('content.withdrawalHistory') }}</div>
    </router-link>
  </div>
  <div class="flex items-end justify-center space-x-5 py-35">
    <div class="text-base font-bold leading-md">$</div>
    <div class="text-xl font-bold leading-xl">{{ balance || 0 }}</div>
  </div>
  <router-link :to="{ name: 'mine-earn-wdrl-req' }">
    <Button>{{ $t('content.withdrawalApply') }}</Button>
  </router-link>
  <div class="mt-30 text-base font-bold leading-md">
    {{ $t('content.dataDashboard') }}
  </div>

  <div class="sticky top-52 z-10 h-35 bg-white">
    <Tab v-model="tab" :options="tabOptions"></Tab>
  </div>
  <div v-show="tab === MINE_EARN_TAB.OVERALL_PREF">
    <div class="grid space-y-30">
      <div class="relative mt-20 flex w-full items-center justify-center space-x-10 px-20 md:px-0 lg:px-0 xl:px-0">
        <div
          @click="onStartDate"
          class="flex w-full cursor-pointer select-none items-center justify-center rounded-full bg-gray-f6 py-6 text-base font-normal leading-md"
        >
          {{ startDateModel.toLocaleString().substring(0, 9) }}
        </div>
        <DatePicker
          v-show="showStartDate"
          v-model="startDateModel"
          :class="{ 'absolute left-0 top-36 z-10': showStartDate, relative: !showStartDate }"
          @close="showStartDate = false"
          @confirm="startHandleConfirm"
        ></DatePicker>
        <div><Icon name="calendar" size="20"></Icon></div>
        <div
          @click="onEndDate"
          class="flex w-full cursor-pointer select-none items-center justify-center rounded-full bg-gray-f6 py-6 text-base font-normal leading-md"
        >
          {{ endDateModel.toLocaleString().substring(0, 9) }}
        </div>
        <DatePicker
          v-show="showEndDate"
          v-model="endDateModel"
          :class="{ 'absolute right-0 top-36 z-10': showEndDate, relative: !showEndDate }"
          @close="showEndDate = false"
          @confirm="endHandleConfirm"
        ></DatePicker>
      </div>
      <div class="flex select-none space-x-30 px-20 md:px-0 lg:px-0 xl:px-0">
        <div class="flex w-4/12 flex-col space-y-10">
          <div class="text-base font-normal leading-md">{{ $t('content.totEntries') }}</div>
          <div class="text-lg font-bold leading-lg">{{ overallData?.total_click || 0 }}</div>
        </div>
        <div class="flex w-4/12 flex-col space-y-10">
          <div class="text-base font-normal leading-md">{{ $t('content.totSubs') }}</div>
          <div class="text-lg font-bold leading-lg">{{ overallData?.total_subscription || 0 }}</div>
        </div>
        <div class="flex w-4/12 flex-col space-y-10">
          <div class="text-base font-normal leading-md">{{ $t('content.totViews') }}</div>
          <div class="text-lg font-bold leading-lg">{{ overallData?.total_view || 0 }}</div>
        </div>
      </div>
      <div class="flex space-x-30 px-20 md:px-0 lg:px-0 xl:px-0">
        <div class="flex w-4/12 flex-col space-y-10">
          <div class="text-base font-normal leading-md">{{ $t('content.purchases') }}</div>
          <div class="text-lg font-bold leading-lg">{{ overallData?.total_buyer || 0 }}</div>
        </div>
        <div class="flex w-4/12 flex-col space-y-10">
          <div class="text-base font-normal leading-md">{{ $t('content.periodIncome') }}</div>
          <div class="text-lg font-bold leading-lg">${{ overallData?.total_income || 0 }}</div>
        </div>
        <div class="flex w-4/12 flex-col justify-start space-y-10">
          <div class="text-base font-normal leading-md">{{ $t('content.unsubscribers') }}</div>
          <div class="text-lg font-bold leading-lg">{{ overallData?.total_unsubscription || 0 }}</div>
        </div>
      </div>
    </div>
  </div>
  <div v-show="tab === MINE_EARN_TAB.POST_PREF">
    <div class="relative mt-20 flex w-full items-center justify-center space-x-10 px-20 md:px-0 lg:px-0 xl:px-0">
      <div
        @click="onStartDate"
        class="flex w-full cursor-pointer select-none items-center justify-center rounded-full bg-gray-f6 py-6 text-base font-normal leading-md"
      >
        {{ startDateModel.toLocaleString().substring(0, 9) }}
      </div>
      <DatePicker
        v-show="showStartDate"
        v-model="startDateModel"
        :class="{ 'absolute left-0 top-36 z-10': showStartDate, relative: !showStartDate }"
        @close="showStartDate = false"
        @confirm="startHandleConfirm"
      ></DatePicker>
      <div><Icon name="calendar" size="20"></Icon></div>
      <div
        @click="onEndDate"
        class="flex w-full cursor-pointer select-none items-center justify-center rounded-full bg-gray-f6 py-6 text-base font-normal leading-md"
      >
        {{ endDateModel.toLocaleString().substring(0, 9) }}
      </div>
      <DatePicker
        v-show="showEndDate"
        v-model="endDateModel"
        :class="{ 'absolute right-0 top-36 z-10': showEndDate, relative: !showEndDate }"
        @close="showEndDate = false"
        @confirm="endHandleConfirm"
      ></DatePicker>
    </div>
    <div class="mt-20">
      <List :items="dataList" item-key="id">
        <template #default="{ item }">
          <EarnPostCard :item="item"></EarnPostCard>
        </template>
        <template #bottom>
          <div class="flex items-center justify-center py-8 text-gray-a3">
            <Loading v-if="isLoading">{{ $t('common.loading') }}</Loading>
            <span v-if="noMore">{{ $t('common.noMore') }}</span>
          </div>
        </template>
      </List>
    </div>
  </div>
</template>
<script setup>
import { onActivated, onDeactivated, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useEarnStore } from '@/store/earn'
import { useMineStore } from '@/store/mine'
import Button from '@comp/common/Button.vue'
import DatePicker from '@comp/form/DatePicker.vue'
import EarnPostCard from '@comp/mine/EarnPostCard.vue'
import Tab from '@comp/navigation/Tab.vue'
import { useInfinite } from '@use/request/infinite'
import { MINE_EARN_TAB } from '@const'
import { toDateYmd } from '@/utils/string-helper'

const earnStore = useEarnStore()
const { refreshOverallData } = earnStore
const { balance, overallData, startDate, endDate } = storeToRefs(earnStore)

const tab = ref(MINE_EARN_TAB.OVERALL_PREF)
const tabOptions = ref([
  { label: 'label.overallPerf', value: MINE_EARN_TAB.OVERALL_PREF },
  { label: 'label.postPerf', value: MINE_EARN_TAB.POST_PREF },
])

const startDateModel = ref(startDate.value)
async function startHandleConfirm() {
  startDate.value = startDateModel.value
  await refreshOverallData()
  params.start_time = toDateYmd(startDate.value)
  await reload()
}
const endDateModel = ref(endDate.value)
async function endHandleConfirm() {
  endDate.value = endDateModel.value
  await refreshOverallData()
  params.end_time = toDateYmd(endDate.value)
  await reload()
}

const showStartDate = ref(false)
const onStartDate = () => {
  showStartDate.value = !showStartDate.value
  showEndDate.value = false
}
const showEndDate = ref(false)
const onEndDate = () => {
  showEndDate.value = !showEndDate.value
  showStartDate.value = false
}

const params = {
  start_time: toDateYmd(startDate.value),
  end_time: toDateYmd(endDate.value),
}

const { dataList, init, next, reload, isLoading, noMore } = useInfinite('Article.stats', {
  params,
})

const { setNextFn, clearNextFn } = useMineStore()

onMounted(() => {
  refreshOverallData()
  init()
})
onActivated(() => setNextFn(next))
onDeactivated(() => clearNextFn(next))
</script>
