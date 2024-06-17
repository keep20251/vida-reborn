<template>
  <BaseMedia>
    <template v-slot:closeBtn="{ config }">
      <button class="text-white/80" @click="config.close()">xcx</button>
    </template>

    <template #content>
      <div class="aaa">content aaa parent</div>
    </template>
  </BaseMedia>
</template>

<script setup>
import { defineAsyncComponent, ref } from 'vue'

const BaseMedia = defineAsyncComponent(() => import('./base/Fullscreen.vue'))
</script>

<style></style>
