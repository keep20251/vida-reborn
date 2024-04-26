<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  id: Number,
  active: Boolean,
})

const emit = defineEmits(['contentClick'])
const handleClick = () => emit('contentClick', props.id)
</script>
<template>
  <div class="official-advantages-content" :class="{ active: active }" @click="handleClick">
    <div class="official-advantages-content-title">
      {{ $t(`official.advantage.${props.id}.title`) }}
    </div>
    <div class="official-advantages-content-subtitle">
      {{ $t(`official.advantage.${props.id}.subtitle`) }}
    </div>
    <div class="official-advantages-content-description">
      {{ $t(`official.advantage.${props.id}.desc`) }}
    </div>
  </div>
</template>
<style lang="scss" scoped>
.official-advantages-content {
  @apply mx-20 mt-20 max-w-[325px] cursor-pointer rounded-br-[2.5em] rounded-tl-[2.5em] px-30 py-30 text-black shadow-md sm:max-w-[355px];
  // about focus and active effects
  @apply hover:bg-primary  hover:text-white hover:shadow-[0_35px_20px_-15px_rgba(0,0,0,0.3)] active:bg-primary active:text-white active:shadow-[0_35px_20px_-15px_rgba(0,0,0,0.3)];
  // transition
  // @apply transition delay-150 ease-in-out;

  &-title {
    font-weight: 900;
    font-size: 24px;
    line-height: 29.45px;
  }
  &-subtitle {
    @apply mt-10 font-medium;
    font-size: 20px;
    line-height: 24.24px;
  }
  &-description {
    @apply mt-10;
    font-size: 14px;
    line-height: 19.6px;
    font-weight: 400;
  }
}
// 暫移除
// .official-advantages-content.active {
//   @apply bg-primary text-white shadow-[0_35px_20px_-15px_rgba(0,0,0,0.3)];
// }
</style>
