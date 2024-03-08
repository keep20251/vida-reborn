<script setup>
defineProps({
  text: { type: String, default: 'Button' },
  bold: { type: Boolean, default: false },
})
const emits = defineEmits(['click'])
</script>

<template>
  <div @click.prevent="emits('click')" class="text-nowrap cursor-pointer text-lg" :class="{ 'font-bold': bold }">
    {{ text }}
  </div>
</template>

<style scoped>
.text-nowrap {
  white-space: nowrap;
}
</style>
