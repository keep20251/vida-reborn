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

  <Tab v-model="tab" :options="tabOptions" class="!h-35"> </Tab>
  <div v-if="tab === 1">
    <div class="grid space-y-40">
      <div class="mt-20 flex items-center justify-center space-x-20 px-20">
        <div
          class="flex w-full cursor-pointer items-center justify-center rounded-full bg-gray-f6 py-6 text-base font-normal leading-md"
        >
          2023-12-31
        </div>
        <div><Icon name="calendar" size="20"></Icon></div>
        <div
          class="flex w-full cursor-pointer items-center justify-center rounded-full bg-gray-f6 py-6 text-base font-normal leading-md"
        >
          2023-12-31
        </div>
      </div>
      <div class="flex select-none space-x-30 px-20">
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
      <div class="flex space-x-30 px-20">
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
    <div class="mb-10 mt-20 flex items-center justify-center space-x-20 px-20">
      <div
        class="flex w-full cursor-pointer items-center justify-center rounded-full bg-gray-f6 py-6 text-base font-normal leading-md"
      >
        2023-12-31
      </div>
      <div><Icon name="calendar" size="20"></Icon></div>
      <div
        class="flex w-full cursor-pointer items-center justify-center rounded-full bg-gray-f6 py-6 text-base font-normal leading-md"
      >
        2023-12-31
      </div>
    </div>
    <div v-for="(media, index) in medias" :key="`earn-media-info-${index}`">
      <EarnPostCard :media="media"></EarnPostCard>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Button from '@comp/common/Button.vue'
import EarnPostCard from '@comp/mine/EarnPostCard.vue'
import Tab from '@comp/navigation/Tab.vue'

const { t: $t } = useI18n()

const tab = ref(1)
const tabOptions = ref([
  { label: $t('label.overallPerf'), value: 1 },
  { label: $t('label.postPerf'), value: 2 },
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
])
</script>
