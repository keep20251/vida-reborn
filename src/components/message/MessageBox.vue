<template>
  <div :class="style">
    <p class="grow whitespace-pre-wrap text-justify" :style="{ 'word-break': 'break-word' }">
      {{ item.content }}
    </p>
    <div class="shrink-0 self-end text-sm" :class="{ 'text-white': item.self, 'text-gray-a3': !item.self }">
      {{ toDateTimeString(new Date(item.timestamp)).substring(11, 16) }}
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { toDateTimeString } from '@/utils/string-helper'

const props = defineProps({
  item: { type: Object, requried: true },
})

const style = computed(() =>
  props.item.self
    ? 'relative mr-8 flex max-w-[80%] space-x-8 self-end rounded-3xl bg-primary px-16 py-10 text-base leading-lg text-white before:absolute before:-right-2 before:bottom-0 before:h-16 before:rounded-bl-lg before:border-r-[1rem] before:border-solid before:border-r-primary after:absolute after:-right-9 after:bottom-0 after:h-16 after:w-10 after:rounded-bl-md after:bg-white md:mr-24 md:max-w-[65%]'
    : 'relative flex max-w-[80%] space-x-8 self-start rounded-3xl bg-gray-f6 px-16 py-10 text-base leading-lg text-black before:absolute before:-left-2 before:bottom-0 before:h-16 before:rounded-br-lg before:border-l-[1rem] before:border-solid before:border-l-gray-f6 after:absolute after:-left-8 after:bottom-0 after:h-16 after:w-10 after:rounded-br-md after:bg-white md:max-w-[65%]',
)
</script>
