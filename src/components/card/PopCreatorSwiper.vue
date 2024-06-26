<template>
  <div class="mt-20 flex h-full flex-col space-y-28" @touchmove.prevent>
    <div class="flex flex-col space-y-10">
      <div class="text-center text-base font-bold">{{ $t('info.popularCreator') }}</div>
      <div class="text-center text-base">{{ $t('info.subscribeToView') }}</div>
    </div>
    <div
      class="relative -ml-20 flex w-[calc(100%+2.5rem)] grow items-center justify-center overflow-hidden"
      ref="swiper"
    >
      <div
        v-for="(item, i) in items"
        :key="item.aff"
        class="absolute left-[50%] h-full w-2/3 rounded-xl"
        :class="{
          'will-change-transform': i >= index - 2 && i <= index + 2 && index % 1 !== 0,
          hidden: !(i >= index - 2 && i <= index + 2),
        }"
        :style="{
          transform:
            i >= index - 2 && i <= index + 2
              ? // -2: translateX(-260%) scale(0.9)
                // -1: translateX(-155%) scale(0.9)
                // 0: translateX(-50%) scale(1)
                // 1: translateX(55%) scale(0.9)
                // 2: translateX(160%) scale(0.9)
                `translateX(${-50 + (i - index) * 105}%) scale(${1 - Math.min(1, Math.abs(i - index)) * 0.1})`
              : 'none',
        }"
        @click="toCreator(item.username)"
      >
        <div v-if="item.background" class="h-full w-full">
          <EncryptImage :src="item.background" :border-radius="15" cover></EncryptImage>
        </div>
        <div
          class="absolute top-0 h-full w-full rounded-inherit bg-gradient-to-b from-[#6466E7] to-[#7FE2D3]"
          :style="{ opacity: 0.8 - 0.7 * Math.min(1, Math.abs(i - index)) }"
        ></div>
        <div class="absolute top-0 flex h-full w-full flex-col items-center rounded-inherit p-20">
          <!-- 暫隱藏 -->
          <!-- <div class="self-end">
            <Icon name="closeWhite" size="20"></Icon>
          </div> -->
          <Avatar class="mt-10" :radius="35" :src="item.thumb" :alt="item.username"></Avatar>
          <div class="mt-10 line-clamp-1 shrink-0 text-lg font-bold text-white">{{ item.nickname }}</div>
          <div class="mt-10 line-clamp-1 shrink-0 text-sm text-white">@{{ item.username }}</div>
          <div class="flex grow items-center overflow-hidden text-base text-white">{{ item.description }}</div>
          <div class="mb-10" @click.stop>
            <Button fit-width @click="open({ items: item?.subscription_list, creator: item })">{{
              $t('common.viewSubscribePlan')
            }}</Button>
          </div>
        </div>
      </div>
      <Loading v-if="items.length === 0"></Loading>
    </div>
    <div class="flex justify-center">
      <Button contrast fit-width @click="reload">{{ $t('common.replace') }}</Button>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useSubsciptionStore } from '@/store/subscription'
import Button from '@comp/common/Button.vue'
import Avatar from '@comp/multimedia/Avatar.vue'
import { useSwipe } from '@use/gesture/swipe'
import { useRouters } from '@use/routers'

const props = defineProps({
  items: { type: Array, required: true },
})

const emits = defineEmits(['load', 'reload'])

const swiper = ref(null)
const items = computed(() => props.items)
const { index, reset } = useSwipe(swiper, items)

watch(index, (v) => {
  if (v === props.items.length - 2) {
    emits('load')
  }
})

function reload() {
  reset()
  emits('reload')
}

const { toCreator } = useRouters()

const { open } = useSubsciptionStore()
</script>
