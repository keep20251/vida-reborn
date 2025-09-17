<template>
  <div class="relative flex h-full items-center justify-center rounded-inherit cursor-pointer" @click.stop="openPlayer">
    <Video
      v-if="url !== ''"
      ref="video"
      :url="url"
      :poster-url="posterUrl"
      :time="time"
      :preview="isLock"
      :replay-signal="replaySignal"
      @play="playEnd = false"
      @ended="playEnd = true"
      @timeupdate="onTimeupdate"
    ></Video>
    <LockInfo v-if="showLockInfo" :item="item" :meta="time" show-image @replay="replaySignal = Date.now()"></LockInfo>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import LockInfo from '@comp/multimedia/LockInfo.vue'
import Video from '@comp/multimedia/Video.vue'
import { useStat } from '@use/utils/stat'
import { toVideoTimeFormat } from '@/utils/string-helper'
import { usePlayerStore } from '@/store/player'

const props = defineProps({
  item: { type: Object, required: true },
  stat: { type: Boolean, default: false },
  preview: { type: Boolean, default: false },
})

const url = computed(() => props.item.url[0]?.url)
const posterUrl = computed(() => props.item.url[1]?.url)
const time = computed(() => toVideoTimeFormat(props.item.url[0]?.video_time || 0))
const isLock = computed(() => !props.item.is_unlock)
// const isLock = computed(() => false)

const playEnd = ref(false)
const replaySignal = ref(null)
const showLockInfo = computed(() => props.preview || (isLock.value && (url.value === '' || playEnd.value)))

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

// 打開播放器
const playerStore = usePlayerStore()
function openPlayer() {
  playerStore.open([props.item], 0)
}
</script>
