<template>
  <div class="flex h-full items-center justify-center rounded-inherit" @click.stop>
    <LockMask v-if="showLockMask" :item="item" show-image @replay="playEnd = false"></LockMask>
    <Video
      v-else
      ref="video"
      :url="url"
      :preview="isLock"
      @play="playEnd = false"
      @ended="playEnd = true"
      @timeupdate="onTimeupdate"
    ></Video>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import LockMask from '@comp/multimedia/LockMask.vue'
import Video from '@comp/multimedia/Video.vue'
import { useStat } from '@use/utils/stat'

const props = defineProps({
  item: { type: Object, required: true },
  stat: { type: Boolean, default: false },
})

const url = computed(() => props.item.url[0]?.url)
const isLock = computed(() => !props.item.is_unlock)
// const isLock = computed(() => false)

const playEnd = ref(false)
const showLockMask = computed(() => isLock.value && (url.value === '' || playEnd.value))

// 統計觀看數據
const video = ref(null)
let playTime = 0
function onTimeupdate(time) {
  playTime = Math.max(time, playTime)
}
if (props.stat) {
  useStat(video, {
    id: props.item.id,
    activeMs: () => Math.floor(playTime * 1000),
  })
}
</script>
