<template>
  <div class="select-none px-20" :class="[{ 'mb-10': isActive, 'mb-30': !isActive }]">
    <div
      @click="() => (isActive = !isActive)"
      class="relative z-10 flex cursor-pointer space-x-10 rounded-xl bg-white px-20 py-15 shadow-[0_0_3px_0_rgba(0,0,0,0.15)]"
    >
      <div class="w-100">
        <img :src="media.img" class="h-full w-full rounded object-cover" alt="" />
      </div>
      <div class="flex flex-1 flex-col space-y-10">
        <div class="text-sm font-normal leading-3">{{ media.title }}</div>
        <div class="flex space-x-10">
          <div class="flex w-3/6 items-center space-x-10">
            <Icon size="20" name="play"></Icon
            ><span class="text-sm font-normal leading-3">{{ media.numberViews }}</span>
          </div>
          <div class="flex w-3/6 items-center space-x-10">
            <Icon size="20" name="comment"></Icon><span class="text-sm font-normal leading-3">{{ media.comment }}</span>
          </div>
        </div>
        <div class="flex space-x-10">
          <div class="flex w-3/6 items-center space-x-10">
            <Icon size="20" name="like"></Icon><span class="text-sm font-normal leading-3">{{ media.like }}</span>
          </div>
          <div class="flex w-3/6 items-center space-x-10">
            <Icon size="20" name="sharePost"></Icon
            ><span class="text-sm font-normal leading-3">{{ media.numberPurchases }}</span>
          </div>
        </div>
      </div>
    </div>
    <div
      :class="[{ 'max-h-[200px]': isActive, 'max-h-0 !p-0': !isActive }]"
      class="z-0 mt-[-1rem] grid w-full space-y-30 rounded-b-lg bg-gray03 p-30 pt-40"
    >
      <div :class="[{ flex: isActive, hidden: !isActive }]" class="flex space-x-15">
        <div class="grid w-3/12 space-y-10">
          <div class="leading-md text-base font-normal">{{ $t('content.numberViews') }}:</div>
          <div class="leading-lg text-lg font-bold">{{ media.numberViews }}</div>
        </div>
        <div class="grid w-3/12 space-y-10">
          <div class="leading-md text-base font-normal">{{ $t('content.watchDaily') }}:</div>
          <div class="leading-lg text-lg font-bold">{{ media.watchDaily }}</div>
        </div>
        <div class="grid w-3/12 space-y-10">
          <div class="leading-md text-base font-normal">{{ $t('content.collect') }}:</div>
          <div class="leading-lg text-lg font-bold">{{ media.collect }}</div>
        </div>
        <div class="grid w-3/12 space-y-10">
          <div class="leading-md text-base font-normal">{{ $t('content.comment') }}:</div>
          <div class="leading-lg text-lg font-bold">{{ media.comment }}</div>
        </div>
      </div>
      <div :class="[{ flex: isActive, hidden: !isActive }]" class="flex space-x-15">
        <div class="grid w-3/12 space-y-10">
          <div class="leading-md text-base font-normal">{{ $t('content.numberShare') }}:</div>
          <div class="leading-lg text-lg font-bold">{{ media.share }}</div>
        </div>
        <div class="grid w-3/12 space-y-10">
          <div class="leading-md text-base font-normal">{{ $t('content.purchases') }}:</div>
          <div class="leading-lg text-lg font-bold">{{ media.numberPurchases }}</div>
        </div>
        <div class="grid w-3/12 space-y-10">
          <div class="leading-md text-base font-normal">{{ $t('content.periodIncome') }}:</div>
          <div class="leading-lg text-lg font-bold">${{ media.periodIncome }}</div>
        </div>
        <div class="grid w-3/12 space-y-10"></div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'

defineProps({
  media: { type: Object, required: true },
})

const isActive = ref(false)
</script>
