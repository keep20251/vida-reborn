<template>
  <div class="flex items-end justify-between pt-28">
    <div class="text-base font-bold leading-[0.875rem]">Your Earnings</div>
    <div class="cursor-pointer text-base font-normal leading-[0.875rem]">提款记录</div>
  </div>
  <div class="flex items-end justify-center gap-x-5 py-35">
    <div class="text-base font-bold leading-[0.875rem]">$</div>
    <div class="text-xl font-bold leading-[1.5625rem]">5,000,000</div>
  </div>
  <Button>提款申请</Button>
  <div class="mt-30 text-base font-bold leading-[0.875rem]">数据仪表板</div>
  <Tab v-model="tab" :options="tabOptions" class="mt-10 !h-35"> </Tab>
  <div v-if="tab === 1">
    <div class="grid gap-y-40">
      <div class="mt-20 flex items-center justify-center gap-x-20 px-20">
        <div
          class="flex w-full cursor-pointer items-center justify-center rounded-full bg-gray03 py-6 text-base font-normal leading-[0.875rem]"
        >
          2023-12-31
        </div>
        <div><Icon name="calendar" size="20"></Icon></div>
        <div
          class="flex w-full cursor-pointer items-center justify-center rounded-full bg-gray03 py-6 text-base font-normal leading-[0.875rem]"
        >
          2023-12-31
        </div>
      </div>
      <div class="flex gap-x-30 px-20">
        <div class="flex w-4/12 flex-col gap-y-10">
          <div class="text-base font-normal leading-[0.875rem]">总进入数量</div>
          <div class="text-lg font-bold leading-[1.125rem]">1000</div>
        </div>
        <div class="flex w-4/12 flex-col gap-y-10">
          <div class="text-base font-normal leading-[0.875rem]">总订阅人数</div>
          <div class="text-lg font-bold leading-[1.125rem]">29k</div>
        </div>
        <div class="flex w-4/12 flex-col gap-y-10">
          <div class="text-base font-normal leading-[0.875rem]">总观看次数</div>
          <div class="text-lg font-bold leading-[1.125rem]">27.5k</div>
        </div>
      </div>
      <div class="flex gap-x-30 px-20">
        <div class="flex w-4/12 flex-col gap-y-10">
          <div class="text-base font-normal leading-[0.875rem]">购买次数</div>
          <div class="text-lg font-bold leading-[1.125rem]">2000</div>
        </div>
        <div class="flex w-4/12 flex-col gap-y-10">
          <div class="text-base font-normal leading-[0.875rem]">期间收益</div>
          <div class="text-lg font-bold leading-[1.125rem]">$9999</div>
        </div>
        <div class="flex w-4/12 flex-col justify-start gap-y-10">
          <div class="text-base font-normal leading-[0.875rem]">退订人数</div>
          <div class="text-lg font-bold leading-[1.125rem]">30</div>
        </div>
      </div>
    </div>
  </div>
  <div v-else-if="tab === 2">
    <div class="mb-10 mt-20 flex items-center justify-center gap-x-20 px-20">
      <div
        class="flex w-full cursor-pointer items-center justify-center rounded-full bg-gray03 py-6 text-base font-normal leading-[0.875rem]"
      >
        2023-12-31
      </div>
      <div><Icon name="calendar" size="20"></Icon></div>
      <div
        class="flex w-full cursor-pointer items-center justify-center rounded-full bg-gray03 py-6 text-base font-normal leading-[0.875rem]"
      >
        2023-12-31
      </div>
    </div>
    <div class="px-20">
      <div
        class="relative z-10 flex cursor-pointer gap-x-10 rounded-xl bg-white px-20 py-15 shadow-[0_0_3px_0_rgba(0,0,0,0.15)]"
      >
        <div class="w-100">
          <img
            src="https://i.postimg.cc/tJZ8B7tL/3fa5f2a5d3f7f8ba457f2376adc2b5ba.jpg"
            class="h-full w-full rounded object-cover"
            alt=""
          />
        </div>
        <div class="flex flex-1 flex-col gap-y-10">
          <div class="text-sm font-normal leading-[0.75rem]">New season! Welcome to my channel!</div>
          <div class="flex gap-x-10">
            <div class="flex w-3/6 items-center gap-x-10">
              <Icon size="20" name="video"></Icon><span class="text-sm font-normal leading-[0.75rem]">23,000</span>
            </div>
            <div class="flex w-3/6 items-center gap-x-10">
              <Icon size="20" name="comment"></Icon><span class="text-sm font-normal leading-[0.75rem]">289</span>
            </div>
          </div>
          <div class="flex gap-x-10">
            <div class="flex w-3/6 items-center gap-x-10">
              <Icon size="20" name="like"></Icon><span class="text-sm font-normal leading-[0.75rem]">113</span>
            </div>
            <div class="flex w-3/6 items-center gap-x-10">
              <Icon size="20" name="sharePost"></Icon><span class="text-sm font-normal leading-[0.75rem]">94</span>
            </div>
          </div>
        </div>
      </div>
      <div class="z-0 mt-[-1rem] grid w-full gap-y-30 rounded-b-lg bg-gray03 p-30 pt-40">
        <div class="flex gap-x-15">
          <div class="grid w-3/12 gap-y-10">
            <div class="text-base font-normal leading-[0.875rem]">观看数量:</div>
            <div class="text-lg font-bold leading-[1.125rem]">29k</div>
          </div>
          <div class="grid w-3/12 gap-y-10">
            <div class="text-base font-normal leading-[0.875rem]">每日观看:</div>
            <div class="text-lg font-bold leading-[1.125rem]">198</div>
          </div>
          <div class="grid w-3/12 gap-y-10">
            <div class="text-base font-normal leading-[0.875rem]">收藏:</div>
            <div class="text-lg font-bold leading-[1.125rem]">3029</div>
          </div>
          <div class="grid w-3/12 gap-y-10">
            <div class="text-base font-normal leading-[0.875rem]">评论:</div>
            <div class="text-lg font-bold leading-[1.125rem]">238</div>
          </div>
        </div>
        <div class="flex gap-x-15">
          <div class="grid w-3/12 gap-y-10">
            <div class="text-base font-normal leading-[0.875rem]">观看数量:</div>
            <div class="text-lg font-bold leading-[1.125rem]">29k</div>
          </div>
          <div class="grid w-3/12 gap-y-10">
            <div class="text-base font-normal leading-[0.875rem]">每日观看:</div>
            <div class="text-lg font-bold leading-[1.125rem]">198</div>
          </div>
          <div class="grid w-3/12 gap-y-10">
            <div class="text-base font-normal leading-[0.875rem]">收藏:</div>
            <div class="text-lg font-bold leading-[1.125rem]">3029</div>
          </div>
          <div class="grid w-3/12 gap-y-10">
            <div class="text-base font-normal leading-[0.875rem]">评论:</div>
            <div class="text-lg font-bold leading-[1.125rem]">238</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import Button from '@comp/common/Button.vue'
import Tab from '@comp/navigation/Tab.vue'

const tab = ref(1)
const tabOptions = ref([
  { label: '整體表現', value: 1 },
  { label: '帖子表現', value: 2 },
])
</script>
