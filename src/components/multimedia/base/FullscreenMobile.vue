<template>
  <div class="flex h-full flex-col items-center px-20">
    <div v-if="config.showCloseBtn" class="flex w-full items-center justify-end">
      <slot v-if="$slots.closeBtn" name="closeBtn" :config="config"> </slot>
      <button v-else class="z-50 rounded-full bg-black/50 p-2 text-white" @click="config.close()">close</button>
    </div>
    <div class="min-h-[450px] w-[353px] max-w-[583px] text-white">
      <slot v-if="$slots.content" name="content" :config="config"> </slot>
      <div v-else>Need Setup Conetnt Here</div>
    </div>

    <div>
      <slot v-if="$slots.dots" name="dots" :config="config"> </slot>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  config: Object,
})
</script>
