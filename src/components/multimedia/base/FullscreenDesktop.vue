<template>
  <div class="h-full w-full text-white">
    <div v-if="config.showCloseBtn" class="fixed z-10 flex w-full items-center justify-end p-20">
      <slot v-if="$slots.closeBtn" name="closeBtn" :config="config"> </slot>
      <button v-else class="z-50 rounded-full bg-black/50 p-2 text-white" @click="config.close()">close</button>
    </div>
    <div class="flex h-full w-full items-center justify-center">
      <div class="flex h-full w-full items-center justify-center">
        <slot v-if="$slots.content" name="content" :config="config" @click.stop> </slot>
        <div v-else>Need Setup Conetnt Here</div>
      </div>
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
