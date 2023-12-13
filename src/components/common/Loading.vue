<template>
  <div class="flex justify-center">
    <div class="relative h-40 w-40">
      <div
        class="origin-[1.25rem_1.25rem] rotate-[0deg] after:absolute after:left-19 after:top-2 after:h-9 after:w-2 after:rounded-md after:bg-gray36"
        :class="[anim1]"
      ></div>
      <div
        class="origin-[1.25rem_1.25rem] rotate-[30deg] after:absolute after:left-19 after:top-2 after:h-9 after:w-2 after:rounded-md after:bg-gray36"
        :class="[anim2]"
      ></div>
      <div
        class="origin-[1.25rem_1.25rem] rotate-[60deg] after:absolute after:left-19 after:top-2 after:h-9 after:w-2 after:rounded-md after:bg-gray36"
        :class="[anim3]"
      ></div>
      <div
        class="origin-[1.25rem_1.25rem] rotate-[90deg] after:absolute after:left-19 after:top-2 after:h-9 after:w-2 after:rounded-md after:bg-gray36"
        :class="[anim4]"
      ></div>
      <div
        class="origin-[1.25rem_1.25rem] rotate-[120deg] after:absolute after:left-19 after:top-2 after:h-9 after:w-2 after:rounded-md after:bg-gray36"
        :class="[anim5]"
      ></div>
      <div
        class="origin-[1.25rem_1.25rem] rotate-[150deg] after:absolute after:left-19 after:top-2 after:h-9 after:w-2 after:rounded-md after:bg-gray36"
        :class="[anim6]"
      ></div>
      <div
        class="origin-[1.25rem_1.25rem] rotate-[180deg] after:absolute after:left-19 after:top-2 after:h-9 after:w-2 after:rounded-md after:bg-gray36"
        :class="[anim7]"
      ></div>
      <div
        class="origin-[1.25rem_1.25rem] rotate-[210deg] after:absolute after:left-19 after:top-2 after:h-9 after:w-2 after:rounded-md after:bg-gray36"
        :class="[anim8]"
      ></div>
      <div
        class="origin-[1.25rem_1.25rem] rotate-[240deg] after:absolute after:left-19 after:top-2 after:h-9 after:w-2 after:rounded-md after:bg-gray36"
        :class="[anim9]"
      ></div>
      <div
        class="origin-[1.25rem_1.25rem] rotate-[270deg] after:absolute after:left-19 after:top-2 after:h-9 after:w-2 after:rounded-md after:bg-gray36"
        :class="[anim10]"
      ></div>
      <div
        class="origin-[1.25rem_1.25rem] rotate-[300deg] after:absolute after:left-19 after:top-2 after:h-9 after:w-2 after:rounded-md after:bg-gray36"
        :class="[anim11]"
      ></div>
      <div
        class="origin-[1.25rem_1.25rem] rotate-[330deg] after:absolute after:left-19 after:top-2 after:h-9 after:w-2 after:rounded-md after:bg-gray36"
        :class="[anim12]"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  rate: { type: Number, default: 1.0, validator: (v) => v >= 0.0 && v <= 1.0 },
})

const anim1 = computed(() =>
  props.rate >= 0.083
    ? props.rate >= 1.0
      ? `animate-[flash_1.2s_linear_-1.1s_infinite]`
      : `opacity-[0.083]`
    : `opacity-0`,
)
const anim2 = computed(() =>
  props.rate >= 0.166
    ? props.rate >= 1.0
      ? `animate-[flash_1.2s_linear_-1s_infinite]`
      : `opacity-[0.166]`
    : `opacity-0`,
)
const anim3 = computed(() =>
  props.rate >= 0.25 ? (props.rate >= 1.0 ? `animate-[flash_1.2s_linear_-0.9s_infinite]` : `opacity-25`) : `opacity-0`,
)
const anim4 = computed(() =>
  props.rate >= 0.333
    ? props.rate >= 1.0
      ? `animate-[flash_1.2s_linear_-0.8s_infinite]`
      : `opacity-[0.333]`
    : `opacity-0`,
)
const anim5 = computed(() =>
  props.rate >= 0.416
    ? props.rate >= 1.0
      ? `animate-[flash_1.2s_linear_-0.7s_infinite]`
      : `opacity-[0.416]`
    : `opacity-0`,
)
const anim6 = computed(() =>
  props.rate >= 0.5 ? (props.rate >= 1.0 ? `animate-[flash_1.2s_linear_-0.6s_infinite]` : `opacity-50`) : `opacity-0`,
)
const anim7 = computed(() =>
  props.rate >= 0.583
    ? props.rate >= 1.0
      ? `animate-[flash_1.2s_linear_-0.5s_infinite]`
      : `opacity-[0.583]`
    : `opacity-0`,
)
const anim8 = computed(() =>
  props.rate >= 0.666
    ? props.rate >= 1.0
      ? `animate-[flash_1.2s_linear_-0.4s_infinite]`
      : `opacity-[0.666]`
    : `opacity-0`,
)
const anim9 = computed(() =>
  props.rate >= 0.75 ? (props.rate >= 1.0 ? `animate-[flash_1.2s_linear_-0.3s_infinite]` : `opacity-75`) : `opacity-0`,
)
const anim10 = computed(() =>
  props.rate >= 0.833
    ? props.rate >= 1.0
      ? `animate-[flash_1.2s_linear_-0.2s_infinite]`
      : `opacity-[0.833]`
    : `opacity-0`,
)
const anim11 = computed(() =>
  props.rate >= 0.916
    ? props.rate >= 1.0
      ? `animate-[flash_1.2s_linear_-0.1s_infinite]`
      : `opacity-[0.916]`
    : `opacity-0`,
)
const anim12 = computed(() => (props.rate >= 1.0 ? `animate-[flash_1.2s_linear_0s_infinite]` : `opacity-0`))
</script>
