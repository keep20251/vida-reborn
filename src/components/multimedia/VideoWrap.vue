<template>
  <div class="flex h-full items-center justify-center rounded-inherit" @click.stop>
    <div v-if="!url" class="animate-bounce">這筆資料有問題...</div>
    <LockMask v-else-if="showLockMask" :item="item" show-image @replay="playEnd = false"></LockMask>
    <Video v-else ref="video" :url="url" :preview="isLock" @play="playEnd = false" @ended="playEnd = true"></Video>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import LockMask from '@comp/multimedia/LockMask.vue'
import Video from '@comp/multimedia/Video.vue'

const props = defineProps({
  item: { type: Object, required: true },
})

const url = computed(() => props.item.url[0]?.url)
const isLock = computed(() => !props.item.is_unlock)
// const isLock = computed(() => false)

const playEnd = ref(false)
const showLockMask = computed(() => isLock.value && playEnd.value)
</script>
