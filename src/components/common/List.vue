<template>
  <div v-for="(item, index) in items" :key="itemKey ? item[itemKey] : index">
    <slot v-bind="{ item, index, last: index === items.length - 1 }"></slot>
    <div v-if="divider" class="h-1 bg-gray-e5"></div>
  </div>
  <div v-if="$slots['bottom']">
    <slot name="bottom"></slot>
  </div>
</template>

<script setup>
defineProps({
  items: { type: Array, required: true },
  itemKey: { type: String },
  divider: { type: Boolean, default: false },
})
</script>
