<template>
  <div class="relative flex h-full items-center justify-center rounded-inherit" @click.stop>
    <Video
      v-if="url !== ''"
      ref="video"
      :url="url"
      :preview="isLock"
      :replay-signal="replaySignal"
      @play="playEnd = false"
      @ended="playEnd = true"
      @timeupdate="onTimeupdate"
    ></Video>
    <LockMask
      v-if="showLockMask"
      :item="item"
      :meta="toVideoTimeFormat(item.url[0]?.video_time || 0)"
      show-image
      @replay="replaySignal = Date.now()"
    ></LockMask>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import LockMask from '@comp/multimedia/LockMask.vue'
import Video from '@comp/multimedia/Video.vue'
import { useStat } from '@use/utils/stat'
import { toVideoTimeFormat } from '@/utils/string-helper'

const props = defineProps({
  item: { type: Object, required: true },
  stat: { type: Boolean, default: false },
})

const url = computed(() => props.item.url[0]?.url)
const isLock = computed(() => !props.item.is_unlock)
// const isLock = computed(() => false)

const playEnd = ref(false)
const replaySignal = ref(null)
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
