<template>
  <div
    class="cursor-pointer rounded-xl bg-gray-f6 px-18 py-9 text-sm font-normal"
    @click="$emit('click', value)"
    :class="{
      'bg-primary text-white': active,
    }"
  >
    {{ label }}
  </div>
</template>
<script setup>
defineProps({
  label: { type: String, default: '' },
  value: { type: [String, Number], default: '' },
  active: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['click'])
</script>
