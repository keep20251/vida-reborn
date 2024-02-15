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
    <div v-if="imgs.length > 1" class="absolute left-20 top-0 flex h-full w-20 cursor-pointer items-center">
      <div
        class="flex h-20 w-20 items-center justify-center rounded-full bg-gray-f6 opacity-60"
        @click.stop="swipe(-1)"
      >
        <Icon name="back" size="16"></Icon>
      </div>
    </div>
    <div v-if="imgs.length > 1" class="absolute right-20 top-0 flex h-full w-20 cursor-pointer items-center">
      <div
        class="flex h-20 w-20 rotate-180 items-center justify-center rounded-full bg-gray-f6 opacity-60"
        @click.stop="swipe(1)"
      >
        <Icon name="back" size="16"></Icon>
      </div>
    </div>
    <div v-if="imgs.length > 1" class="absolute bottom-20 right-20 select-none text-base text-white">
      {{ `${currIndex + 1}/${imgs.length}` }}
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  imgs: { type: Array, required: true },
  index: { type: Number, default: 0 },
})

const currIndex = ref(props.index)

function swipe(delta) {
  if ((currIndex.value === 0 && delta < 0) || (currIndex.value === props.imgs.length - 1 && delta > 0)) {
    return
  }

  currIndex.value += delta
}
</script>
