<template>
  <div>
    <div>
      <div v-for="(item, index) in items" :key="itemKey ? item[itemKey] : index">
        <slot v-bind="{ item, index, last: index === items.length - 1 }"></slot>
      </div>
    </div>
    <div v-if="$slots['bottom']">
      <slot name="bottom"></slot>
    </div>
  </div>
</template>

<script setup>
defineProps({
  items: { type: Array, required: true },
  itemKey: { type: String },
})
</script>
