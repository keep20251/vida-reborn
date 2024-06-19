<template>
  <div class="relative h-full w-full overflow-hidden rounded-inherit" ref="swiper">
    <div
      v-for="(img, i) in imgs"
      class="absolute top-0 h-full w-full"
      :class="{ 'will-change-transform': animIndex % 1 !== 0 }"
      :style="{ transform: `translateX(${(i - animIndex) * 100}%)` }"
      :key="i"
      @click="
        handleActiveFullScreen({
          mediaList: imgs,
          mediaCurrentIndex: i,
          isLock: isLock,
          item: item,
          index: index,
          stat: stat,
        })
      "
    >
      <EncryptImage
        :src="img.url"
        :border-radius="10"
        :active="i >= currIndex - 1 && i <= currIndex + 1"
        cover
      ></EncryptImage>
    </div>

    <div v-if="imgs.length > 1" class="absolute bottom-20 right-20 flex select-none space-x-5">
      <Icon name="cameraWhite" size="20"></Icon>
      <span class="text-base text-white">{{ `${currIndex + 1}/${imgs.length}` }}</span>
    </div>
    <LockMask v-if="isLock" :item="item" :meta="`${currIndex + 1}/${imgs.length}`"></LockMask>
    <div
      v-if="isDesktop && imgs.length > 1 && currIndex >= 1"
      class="absolute left-0 top-0 flex h-full w-40 cursor-pointer items-center justify-end"
      @click.stop="prev()"
    >
      <div class="flex h-20 w-20 items-center justify-center rounded-full bg-gray-f6 opacity-60">
        <Icon name="back" size="16"></Icon>
      </div>
    </div>
    <div
      v-if="isDesktop && imgs.length > 1 && currIndex < imgs.length - 1"
      class="absolute right-0 top-0 flex h-full w-40 cursor-pointer items-center justify-start"
      @click.stop="next()"
    >
      <div class="flex h-20 w-20 rotate-180 items-center justify-center rounded-full bg-gray-f6 opacity-60">
        <Icon name="back" size="16"></Icon>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { whenever } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/store/app'
import { useFullscreenStore } from '@/store/fullscreen'
import LockMask from '@comp/multimedia/LockMask.vue'
import { useSwipe } from '@use/gesture/swipe'
import { useStat } from '@use/utils/stat'

const props = defineProps({
  item: { type: Object, required: true },
  index: { type: Number, default: 0 },
  stat: { type: Boolean, default: false },
})

const appStore = useAppStore()
const { isDesktop } = storeToRefs(appStore)

const currIndex = ref(props.index)
const imgs = computed(() => props.item.url)

const isLock = computed(() => !props.item.is_unlock && (imgs.value.length === 1 || animIndex.value > 0))
// const isLock = computed(() => false)

const swiper = ref(null)
const { index: animIndex, transitioning, prev, next } = useSwipe(swiper, imgs, { initIndex: props.index })
whenever(
  () => transitioning.value === false,
  () => (currIndex.value = animIndex.value),
)

// 統計觀看數據
let startTime
if (props.stat) {
  useStat(swiper, {
    id: props.item.id,
    activeFn: () => (startTime = Date.now()),
    activeMs: () => Date.now() - startTime,
  })
}
const { open } = useFullscreenStore()
const handleActiveFullScreen = (props) => open(props)
</script>
