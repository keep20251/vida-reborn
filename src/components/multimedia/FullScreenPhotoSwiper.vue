<template>
  <BaseMedia>
    <template v-slot:closeBtn="{ config }">
      <button @click.prevent="config.close()">x</button>
    </template>

    <template v-slot:content="{}">
      <div class="w-full" @click="console.log('content')">
        <div class="p-5">1</div>
        <div>2</div>
        <div>3</div>
      </div>
    </template>
  </BaseMedia>
</template>

<script setup>
import { defineAsyncComponent, ref } from 'vue'

const BaseMedia = defineAsyncComponent(() => import('./base/Fullscreen.vue'))
</script>
