<template>
  <div class="relative h-full w-full overflow-hidden rounded-inherit">
    <div
      v-for="(img, i) in imgs"
      class="absolute top-0 h-full w-full transition-transform"
      :style="{ transform: `translateX(${(i - currIndex) * 100}%)` }"
      :key="i"
    >
      <EncryptImage
        :src="img.url"
        :border-radius="10"
        :active="i >= currIndex - 1 && i <= currIndex + 1"
        cover
      ></EncryptImage>
    </div>
    <div v-if="imgs.length > 1" class="absolute bottom-20 right-20 select-none text-base text-white">
      {{ `${currIndex + 1}/${imgs.length}` }}
    </div>
    <LockMask v-if="isLock" :item="item"></LockMask>
    <div v-if="imgs.length > 1" class="absolute left-10 top-0 flex h-full w-40 items-center">
      <div class="flex h-40 w-40 items-center justify-start pl-10" @click.stop="swipe(-1)">
        <div class="flex h-20 w-20 cursor-pointer items-center justify-center rounded-full bg-gray-f6 opacity-60">
          <Icon name="back" size="16"></Icon>
        </div>
      </div>
    </div>
    <div v-if="imgs.length > 1" class="absolute right-10 top-0 flex h-full w-40 items-center">
      <div class="flex h-40 w-40 items-center justify-end pr-10" @click.stop="swipe(1)">
        <div
          class="flex h-20 w-20 rotate-180 cursor-pointer items-center justify-center rounded-full bg-gray-f6 opacity-60"
        >
          <Icon name="back" size="16"></Icon>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import LockMask from '@comp/multimedia/LockMask.vue'

const props = defineProps({
  item: { type: Object, required: true },
  index: { type: Number, default: 0 },
})

const currIndex = ref(props.index)
const imgs = computed(() => props.item.url)

const isLock = computed(() => !props.item.is_unlock && (imgs.value.length === 1 || currIndex.value > 0))
// const isLock = computed(() => false)

function swipe(delta) {
  if ((currIndex.value === 0 && delta < 0) || (currIndex.value === imgs.value.length - 1 && delta > 0)) {
    return
  }

  if (isLock.value && delta > 0) {
    return
  }

  currIndex.value += delta
}
</script>
