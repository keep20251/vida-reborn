<template>
  <div class="flex h-full items-center justify-center rounded-inherit">
    <div v-if="isGarbage" class="animate-bounce">這筆資料是廢物</div>
    <Video v-else :url="urls[0].url"></Video>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import Video from '@comp/multimedia/Video.vue'

const props = defineProps({
  urls: { type: Array, required: true },
})

const isGarbage = computed(() => !props.urls[0] || !props.urls[0].url)
</script>
