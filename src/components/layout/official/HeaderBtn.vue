<script setup>
import Link from '@comp/common/Link.vue'

defineProps({
  href: { type: String, default: '' },
  text: { type: String, default: 'Button' },
  bold: { type: Boolean, default: false },
})
const emits = defineEmits(['click'])
</script>

<template>
  <Link :href="href">
    <div @click.prevent="emits('click')" class="text-nowrap cursor-pointer text-lg" :class="{ 'font-bold': bold }">
      {{ $t(text) }}
    </div>
  </Link>
</template>

<style scoped>
.text-nowrap {
  white-space: nowrap;
}
</style>
