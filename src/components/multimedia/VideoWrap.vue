<template>
  <div class="flex h-full items-center justify-center rounded-inherit">
    <div v-if="!url" class="animate-bounce">這筆資料有問題...</div>
    <LockMask v-else-if="isLock" :item="item" show-image></LockMask>
    <Video v-else :url="url"></Video>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import LockMask from '@comp/multimedia/LockMask.vue'
import Video from '@comp/multimedia/Video.vue'

const props = defineProps({
  item: { type: Object, required: true },
})

const url = computed(() => props.item.url[0]?.url)
const isLock = computed(() => !props.item.is_unlock)
// const isLock = computed(() => false)
</script>
