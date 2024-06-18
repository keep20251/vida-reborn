<template>
  <div class="text-white">
    <div v-if="config.showCloseBtn" class="flex h-[3rem] w-full items-center justify-end pr-5">
      <slot v-if="$slots.closeBtn" name="closeBtn" :config="config"> </slot>
      <button v-else class="z-50 rounded-full bg-black/50 p-2 text-white" @click="config.close()">close</button>
    </div>
    <div class="flex items-center justify-center">
      <div class="flex h-20 max-h-[900px] min-h-[600px] min-w-[540px] items-center justify-center">
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
