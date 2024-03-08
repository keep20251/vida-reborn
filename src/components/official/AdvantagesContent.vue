<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  title: String,
  subtitle: String,
  desc: String,
})
</script>
<template>
  <div class="official-advantages-content">
    <div class="official-advantages-content-title">{{ title }}</div>
    <div class="official-advantages-content-subtitle">{{ subtitle }}</div>
    <div class="official-advantages-content-description">{{ desc }}</div>
  </div>
</template>
<style lang="scss" scoped>
.official-advantages-content {
  @apply min-w-[321px] rounded-br-3xl rounded-tl-3xl px-30 py-30 shadow-md;
  &-title {
    font-weight: 900;
    font-size: 24px;
    line-height: 29.45px;
    color: rgba(0, 0, 0, 1);
  }
  &-subtitle {
    @apply mt-10 font-medium;
    font-size: 20px;
    line-height: 24.24px;
    color: rgba(0, 0, 0, 1);
  }
  &-description {
    @apply mt-10;
    font-size: 14px;
    line-height: 19.6px;
    font-weight: 400;
    color: rgba(56, 56, 56, 1);
  }
}
</style>
