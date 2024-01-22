<template>
  <div class="flex items-end justify-between pt-8">
    <div class="leading-md text-base font-bold">Your Earnings</div>
    <div class="leading-md cursor-pointer text-base font-normal">提款记录</div>
  </div>
  <div class="flex items-end justify-center space-x-5 py-35">
    <div class="leading-md text-base font-bold">$</div>
    <div class="leading-xl text-xl font-bold">5,000,000</div>
  </div>
  <Button>提款申请</Button>
  <div class="leading-md mt-30 text-base font-bold">数据仪表板</div>
  <Tab v-model="tab" :options="tabOptions" class="!h-35"> </Tab>
  <div v-if="tab === 1">
    <div class="grid space-y-40">
      <div class="mt-20 flex items-center justify-center space-x-20 px-20">
        <div
          class="leading-md flex w-full cursor-pointer items-center justify-center rounded-full bg-gray03 py-6 text-base font-normal"
        >
          2023-12-31
        </div>
        <div><Icon name="calendar" size="20"></Icon></div>
        <div
          class="leading-md flex w-full cursor-pointer items-center justify-center rounded-full bg-gray03 py-6 text-base font-normal"
        >
          2023-12-31
        </div>
      </div>
      <div class="flex select-none space-x-30 px-20">
        <div class="flex w-4/12 flex-col space-y-10">
          <div class="leading-md text-base font-normal">总进入数量</div>
          <div class="leading-lg text-lg font-bold">1000</div>
        </div>
        <div class="flex w-4/12 flex-col space-y-10">
          <div class="leading-md text-base font-normal">总订阅人数</div>
          <div class="leading-lg text-lg font-bold">29k</div>
        </div>
        <div class="flex w-4/12 flex-col space-y-10">
          <div class="leading-md text-base font-normal">总观看次数</div>
          <div class="leading-lg text-lg font-bold">27.5k</div>
        </div>
      </div>
      <div class="flex space-x-30 px-20">
        <div class="flex w-4/12 flex-col space-y-10">
          <div class="leading-md text-base font-normal">购买次数</div>
          <div class="leading-lg text-lg font-bold">2000</div>
        </div>
        <div class="flex w-4/12 flex-col space-y-10">
          <div class="leading-md text-base font-normal">期间收益</div>
          <div class="leading-lg text-lg font-bold">$9999</div>
        </div>
        <div class="flex w-4/12 flex-col justify-start space-y-10">
          <div class="leading-md text-base font-normal">退订人数</div>
          <div class="leading-lg text-lg font-bold">30</div>
        </div>
      </div>
    </div>
  </div>
  <div v-else-if="tab === 2">
    <div class="mb-10 mt-20 flex items-center justify-center space-x-20 px-20">
      <div
        class="leading-md flex w-full cursor-pointer items-center justify-center rounded-full bg-gray03 py-6 text-base font-normal"
      >
        2023-12-31
      </div>
      <div><Icon name="calendar" size="20"></Icon></div>
      <div
        class="leading-md flex w-full cursor-pointer items-center justify-center rounded-full bg-gray03 py-6 text-base font-normal"
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
import Button from '@comp/common/Button.vue'
import Tab from '@comp/navigation/Tab.vue'
import EarnPostCard from '@comp/mine/EarnPostCard.vue'

const tab = ref(1)
const tabOptions = ref([
  { label: '整體表現', value: 1 },
  { label: '帖子表現', value: 2 },
])

const medias = ref([
  {
    img: 'https://i.postimg.cc/tJZ8B7tL/3fa5f2a5d3f7f8ba457f2376adc2b5ba.jpg',
    title: 'New season! Welcome to my channel!',
    play: 23000,
    comment: 289,
    like: 113,
    share: 94,
    numberViews: 999,
    watchDaily: 198,
    collect: 3029,
    msg: 289,
    numberPurchases: 1359,
    earn: 83030,
  },
  {
    img: 'https://i.postimg.cc/tJZ8B7tL/3fa5f2a5d3f7f8ba457f2376adc2b5ba.jpg',
    title: 'New season! Welcome to my channel!',
    play: 23000,
    comment: 289,
    like: 113,
    share: 94,
    numberViews: 999,
    watchDaily: 198,
    collect: 3029,
    msg: 289,
    numberPurchases: 1359,
    earn: 83030,
  },
  {
    img: 'https://i.postimg.cc/tJZ8B7tL/3fa5f2a5d3f7f8ba457f2376adc2b5ba.jpg',
    title: 'New season! Welcome to my channel!',
    play: 23000,
    comment: 289,
    like: 113,
    share: 94,
    numberViews: 999,
    watchDaily: 198,
    collect: 3029,
    msg: 289,
    numberPurchases: 1359,
    earn: 83030,
  },
])
</script>
