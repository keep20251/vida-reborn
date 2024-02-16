<template>
  <Client-Only>
    <MineMain v-if="wideEnough"></MineMain>
    <MineSetList v-else></MineSetList>
  </Client-Only>
</template>
<script setup>
import { computed } from 'vue'
import { useWindowSize } from '@vueuse/core'
import MineMain from '@/pages/mine/MineMain.vue'
import MineSetList from '@/pages/mine/MineSetList.vue'

const { width } = useWindowSize()
const wideEnough = computed(() => width.value > 958)
</script>
