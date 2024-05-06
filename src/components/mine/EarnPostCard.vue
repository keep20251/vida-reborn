<template>
  <div class="select-none" :class="[{ 'mb-10': isActive, 'mb-30': !isActive }]">
    <div
      @click="() => (isActive = !isActive)"
      class="relative flex cursor-pointer space-x-10 rounded-xl bg-white px-20 py-15 shadow-sm"
    >
      <EncryptImage :src="item.url_detail[0].url" :width="105" :height="70" cover></EncryptImage>
      <div class="flex flex-1 flex-col space-y-10">
        <div class="text-sm font-normal leading-3">{{ item.title }}</div>
        <div class="flex space-x-10">
          <div class="flex w-3/6 items-center space-x-10">
            <Icon size="20" name="play"></Icon><span class="text-sm font-normal leading-3">{{ item.total_view }}</span>
          </div>
          <div class="flex w-3/6 items-center space-x-10">
            <Icon size="20" name="comment"></Icon
            ><span class="text-sm font-normal leading-3">{{ item.total_comment }}</span>
          </div>
        </div>
        <div class="flex space-x-10">
          <div class="flex w-3/6 items-center space-x-10">
            <Icon size="20" name="like"></Icon><span class="text-sm font-normal leading-3">{{ item.total_like }}</span>
          </div>
          <div class="flex w-3/6 items-center space-x-10">
            <Icon size="20" name="sharePost"></Icon
            ><span class="text-sm font-normal leading-3">{{ item.total_share }}</span>
          </div>
        </div>
      </div>
    </div>
    <div
      :class="[{ 'max-h-[200px]': isActive, 'max-h-0 !p-0': !isActive }]"
      class="-mt-16 grid w-full space-y-30 rounded-b-lg bg-gray-f6 p-30 pt-40"
    >
      <div :class="[{ flex: isActive, hidden: !isActive }]" class="flex space-x-15">
        <div class="grid w-3/12 space-y-10">
          <div class="text-base font-normal leading-md">{{ $t('content.numberViews') }}:</div>
          <div class="text-lg font-bold leading-lg">{{ item.total_view }}</div>
        </div>
        <div class="grid w-3/12 space-y-10">
          <div class="text-base font-normal leading-md">{{ $t('content.watchDaily') }}:</div>
          <div class="text-lg font-bold leading-lg">{{ item.total_average_view }}</div>
        </div>
        <div class="grid w-3/12 space-y-10">
          <div class="text-base font-normal leading-md">{{ $t('content.collect') }}:</div>
          <div class="text-lg font-bold leading-lg">{{ item.total_like }}</div>
        </div>
        <div class="grid w-3/12 space-y-10">
          <div class="text-base font-normal leading-md">{{ $t('content.comment') }}:</div>
          <div class="text-lg font-bold leading-lg">{{ item.total_comment }}</div>
        </div>
      </div>
      <div :class="[{ flex: isActive, hidden: !isActive }]" class="flex space-x-15">
        <div class="grid w-3/12 space-y-10">
          <div class="text-base font-normal leading-md">{{ $t('content.numberShare') }}:</div>
          <div class="text-lg font-bold leading-lg">{{ item.total_share }}</div>
        </div>
        <div class="grid w-3/12 space-y-10">
          <div class="text-base font-normal leading-md">{{ $t('content.purchases') }}:</div>
          <div class="text-lg font-bold leading-lg">{{ item.total_buy_article_count }}</div>
        </div>
        <div class="grid w-3/12 space-y-10">
          <div class="text-base font-normal leading-md">{{ $t('content.periodIncome') }}:</div>
          <div class="text-lg font-bold leading-lg">${{ item.total_buy_article_income }}</div>
        </div>
        <div class="grid w-3/12 space-y-10"></div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'

defineProps({
  item: { type: Object, required: true },
})
const isActive = ref(false)
</script>
