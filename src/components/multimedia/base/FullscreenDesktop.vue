<template>
  <div class="flex h-[3rem] w-full items-center justify-end pr-5">
    <slot v-if="$slots.closeBtn" name="closeBtn" :config="config"> </slot>
    <button v-else class="z-50 rounded-full bg-black/50 p-2 text-white" @click="config.close()">close</button>
  </div>
  <div class="h-[calc(100vh-3rem)]">
    <slot v-if="$slots.content" name="content" :config="config"> </slot>
    <div v-else>Need Setup Conetnt Here</div>
  </div>
</template>

<script setup>
const props = defineProps({
  config: Object,
})
</script>
