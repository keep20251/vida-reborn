<template>
  <!-- 用於展示創作者頁面的SocialLink -->
  <div class="" :class="{ 'cursor-pointer': !!url }">
    <a v-if="!!url" :href="url" class="flex items-center justify-center" target="_blank">
      <Icon :name="iconName" :size="size"></Icon>
    </a>
    <span v-else class="flex items-center justify-center">
      <Icon :name="iconName" :size="size"></Icon>
    </span>
  </div>
</template>
<script setup>
import { computed } from 'vue'

const props = defineProps({
  // 直接傳instagram, facebook, youtube, twitter, tiktok，會根據有沒有傳url來決定icon的樣式
  name: { type: String, required: true },
  url: { type: String, default: '' },
  size: { type: String, default: '15' },
})

const iconName = computed(() => (props.url ? `${props.name}Active` : `${props.name}Deactive`))
</script>
