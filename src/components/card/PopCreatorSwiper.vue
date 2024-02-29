<template>
  <div class="mt-20 flex h-full flex-col space-y-28">
    <div class="flex flex-col space-y-10">
      <div class="text-center text-base font-bold">{{ $t('info.popularCreator') }}</div>
      <div class="text-center text-base">{{ $t('info.subscribeToView') }}</div>
    </div>
    <div class="relative -ml-20 flex w-[calc(100%+2.5rem)] grow items-center justify-center overflow-hidden">
      <div
        v-for="(item, i) in items"
        :key="item.aff"
        class="absolute left-[50%] h-full w-2/3 rounded-xl transition-transform"
        :class="{
          '-translate-x-[260%]': i < currIndex - 1,
          '-translate-x-[155%]': i < currIndex,
          '-translate-x-[50%]': i === currIndex,
          'translate-x-[55%]': i > currIndex,
          'translate-x-[160%]': i > currIndex + 1,
          'scale-90': i !== currIndex,
          hidden: i < currIndex - 2 || i > currIndex + 2,
        }"
      >
        <div v-if="item.background" class="h-full w-full">
          <EncryptImage :src="item.background" :border-radius="15" cover></EncryptImage>
        </div>
        <div
          class="absolute top-0 flex h-full w-full flex-col items-center rounded-inherit p-20"
          :class="{
            'bg-gradient-to-b from-[#6466E7] to-[#7FE2D3] opacity-80': i === currIndex,
            'bg-black opacity-70': i !== currIndex,
          }"
        >
          <div class="self-end">
            <Icon name="closeWhite" size="20"></Icon>
          </div>
          <Avatar class="mt-10" :radius="35" :src="item.thumb" :alt="item.username"></Avatar>
          <div class="mt-10 line-clamp-1 shrink-0 text-lg font-bold text-white">{{ item.nickname }}</div>
          <div class="mt-10 line-clamp-1 shrink-0 text-sm text-white">@{{ item.username }}</div>
          <div class="flex grow items-center overflow-hidden text-base text-white">{{ item.description }}</div>
          <div class="mb-10">
            <Button>{{ $t('common.viewSubscribePlan') }}</Button>
          </div>
        </div>
      </div>
      <div class="absolute left-20 top-0 flex h-full w-20 cursor-pointer items-center">
        <div
          class="flex h-20 w-20 items-center justify-center rounded-full bg-gray-f6 opacity-60"
          @click.stop="swipe(-1)"
        >
          <Icon name="back" size="16"></Icon>
        </div>
      </div>
      <div class="absolute right-20 top-0 flex h-full w-20 cursor-pointer items-center">
        <div
          class="flex h-20 w-20 rotate-180 items-center justify-center rounded-full bg-gray-f6 opacity-60"
          @click.stop="swipe(1)"
        >
          <Icon name="back" size="16"></Icon>
        </div>
      </div>
      <Loading v-if="items.length === 0"></Loading>
    </div>
    <div class="flex">
      <Button contrast>{{ $t('common.replace') }}</Button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Button from '@comp/common/Button.vue'
import Avatar from '@comp/multimedia/Avatar.vue'

const props = defineProps({
  items: { type: Array, required: true },
})

const currIndex = ref(0)
function swipe(delta) {
  if ((currIndex.value === 0 && delta < 0) || (currIndex.value === props.items.length - 1 && delta > 0)) {
    return
  }
  currIndex.value += delta
}
</script>
