<template>
  <div class="flex items-end justify-between pt-8">
    <div class="text-base font-bold leading-md">{{ $t('content.currentEarn') }}</div>
    <router-link :to="{ name: 'mine-earn-wdrl-hist' }">
      <div class="text-base font-normal leading-md">{{ $t('content.withdrawalHistory') }}</div>
    </router-link>
  </div>
  <div class="flex items-end justify-center space-x-5 py-35">
    <div class="text-base font-bold leading-md">$</div>
    <div class="text-xl font-bold leading-xl">5,000,000</div>
  </div>
  <router-link :to="{ name: 'mine-earn-wdrl-req' }">
    <Button>{{ $t('content.withdrawalApply') }}</Button>
  </router-link>
  <div class="mt-30 text-base font-bold leading-md">{{ $t('content.dataDashboard') }}</div>

  <div class="sticky top-52 z-10 h-35 bg-white">
    <Tab v-model="tab" :options="tabOptions"></Tab>
  </div>
  <div v-if="tab === 1">
    <div class="grid space-y-30">
      <div class="relative mt-20 flex w-full items-center justify-center space-x-10 px-20 md:px-0 lg:px-0 xl:px-0">
        <div
          @click="onStartDate"
          class="flex w-full cursor-pointer select-none items-center justify-center rounded-full bg-gray-f6 py-6 text-base font-normal leading-md"
        >
          {{ startDateValue.toLocaleString().substring(0, 9) }}
        </div>
        <DatePicker
          v-show="showStartDate"
          v-model="startDateValue"
          :class="{ 'absolute left-0 top-36 z-10': showStartDate, relative: !showStartDate }"
          @close="showStartDate = false"
        ></DatePicker>
        <div><Icon name="calendar" size="20"></Icon></div>
        <div
          @click="onEndDate"
          class="flex w-full cursor-pointer select-none items-center justify-center rounded-full bg-gray-f6 py-6 text-base font-normal leading-md"
        >
          {{ endDateValue.toLocaleString().substring(0, 9) }}
        </div>
        <DatePicker
          v-show="showEndDate"
          v-model="endDateValue"
          :class="{ 'absolute right-0 top-36 z-10': showEndDate, relative: !showEndDate }"
          @close="showEndDate = false"
        ></DatePicker>
      </div>
      <div class="flex select-none space-x-30 px-20 md:px-0 lg:px-0 xl:px-0">
        <div class="flex w-4/12 flex-col space-y-10">
          <div class="text-base font-normal leading-md">{{ $t('content.totEntries') }}</div>
          <div class="text-lg font-bold leading-lg">1000</div>
        </div>
        <div class="flex w-4/12 flex-col space-y-10">
          <div class="text-base font-normal leading-md">{{ $t('content.totSubs') }}</div>
          <div class="text-lg font-bold leading-lg">29k</div>
        </div>
        <div class="flex w-4/12 flex-col space-y-10">
          <div class="text-base font-normal leading-md">{{ $t('content.totViews') }}</div>
          <div class="text-lg font-bold leading-lg">27.5k</div>
        </div>
      </div>
      <div class="flex space-x-30 px-20 md:px-0 lg:px-0 xl:px-0">
        <div class="flex w-4/12 flex-col space-y-10">
          <div class="text-base font-normal leading-md">{{ $t('content.purchases') }}</div>
          <div class="text-lg font-bold leading-lg">2000</div>
        </div>
        <div class="flex w-4/12 flex-col space-y-10">
          <div class="text-base font-normal leading-md">{{ $t('content.periodIncome') }}</div>
          <div class="text-lg font-bold leading-lg">$9999</div>
        </div>
        <div class="flex w-4/12 flex-col justify-start space-y-10">
          <div class="text-base font-normal leading-md">{{ $t('content.unsubscribers') }}</div>
          <div class="text-lg font-bold leading-lg">30</div>
        </div>
      </div>
    </div>
  </div>
  <div v-else-if="tab === 2">
    <div class="relative mt-20 flex w-full items-center justify-center space-x-10 px-20 md:px-0 lg:px-0 xl:px-0">
      <div
        @click="onStartDate"
        class="flex w-full cursor-pointer select-none items-center justify-center rounded-full bg-gray-f6 py-6 text-base font-normal leading-md"
      >
        {{ startDateValue.toLocaleString().substring(0, 9) }}
      </div>
      <DatePicker
        v-show="showStartDate"
        v-model="startDateValue"
        :class="{ 'absolute left-0 top-36 z-10': showStartDate, relative: !showStartDate }"
        @close="showStartDate = false"
      ></DatePicker>
      <div><Icon name="calendar" size="20"></Icon></div>
      <div
        @click="onEndDate"
        class="flex w-full cursor-pointer select-none items-center justify-center rounded-full bg-gray-f6 py-6 text-base font-normal leading-md"
      >
        {{ endDateValue.toLocaleString().substring(0, 9) }}
      </div>
      <DatePicker
        v-show="showEndDate"
        v-model="endDateValue"
        :class="{ 'absolute right-0 top-36 z-10': showEndDate, relative: !showEndDate }"
        @close="showEndDate = false"
      ></DatePicker>
    </div>
    <div class="mt-20" v-for="(media, index) in medias" :key="`earn-media-info-${index}`">
      <EarnPostCard :media="media"></EarnPostCard>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import Button from '@comp/common/Button.vue'
import DatePicker from '@comp/form/DatePicker.vue'
import EarnPostCard from '@comp/mine/EarnPostCard.vue'
import Tab from '@comp/navigation/Tab.vue'

const tab = ref(1)
const tabOptions = ref([
  { label: 'label.overallPerf', value: 1 },
  { label: 'label.postPerf', value: 2 },
])

const medias = ref([
  {
    img: 'https://i.postimg.cc/tJZ8B7tL/3fa5f2a5d3f7f8ba457f2376adc2b5ba.jpg',
    title: 'New season! Welcome to my channel!',
    comment: 289,
    like: 113,
    share: 94,
    numberViews: 999,
    watchDaily: 198,
    collect: 3029,
    numberPurchases: 1359,
    periodIncome: 83030,
  },
  {
    img: 'https://i.postimg.cc/tJZ8B7tL/3fa5f2a5d3f7f8ba457f2376adc2b5ba.jpg',
    title: 'New season! Welcome to my channel!',
    comment: 289,
    like: 113,
    share: 94,
    numberViews: 999,
    watchDaily: 198,
    collect: 3029,
    numberPurchases: 1359,
    periodIncome: 83030,
  },
  {
    img: 'https://i.postimg.cc/tJZ8B7tL/3fa5f2a5d3f7f8ba457f2376adc2b5ba.jpg',
    title: 'New season! Welcome to my channel!',
    comment: 289,
    like: 113,
    share: 94,
    numberViews: 999,
    watchDaily: 198,
    collect: 3029,
    numberPurchases: 1359,
    periodIncome: 83030,
  },
  {
    img: 'https://i.postimg.cc/tJZ8B7tL/3fa5f2a5d3f7f8ba457f2376adc2b5ba.jpg',
    title: 'New season! Welcome to my channel!',
    comment: 289,
    like: 113,
    share: 94,
    numberViews: 999,
    watchDaily: 198,
    collect: 3029,
    numberPurchases: 1359,
    periodIncome: 83030,
  },
  {
    img: 'https://i.postimg.cc/tJZ8B7tL/3fa5f2a5d3f7f8ba457f2376adc2b5ba.jpg',
    title: 'New season! Welcome to my channel!',
    comment: 289,
    like: 113,
    share: 94,
    numberViews: 999,
    watchDaily: 198,
    collect: 3029,
    numberPurchases: 1359,
    periodIncome: 83030,
  },
  {
    img: 'https://i.postimg.cc/tJZ8B7tL/3fa5f2a5d3f7f8ba457f2376adc2b5ba.jpg',
    title: 'New season! Welcome to my channel!',
    comment: 289,
    like: 113,
    share: 94,
    numberViews: 999,
    watchDaily: 198,
    collect: 3029,
    numberPurchases: 1359,
    periodIncome: 83030,
  },
  {
    img: 'https://i.postimg.cc/tJZ8B7tL/3fa5f2a5d3f7f8ba457f2376adc2b5ba.jpg',
    title: 'New season! Welcome to my channel!',
    comment: 289,
    like: 113,
    share: 94,
    numberViews: 999,
    watchDaily: 198,
    collect: 3029,
    numberPurchases: 1359,
    periodIncome: 83030,
  },
])

const showStartDate = ref(false)
const onStartDate = () => {
  showStartDate.value = !showStartDate.value
  showEndDate.value = false
}
const startDateValue = ref(new Date())

const showEndDate = ref(false)
const onEndDate = () => {
  showEndDate.value = !showEndDate.value
  showStartDate.value = false
}
const endDateValue = ref(new Date())
</script>
