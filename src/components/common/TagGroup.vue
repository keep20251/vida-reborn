<template>
  <div class="flex flex-wrap space-x-10">
    <div
      v-for="(tag, index) in props.items"
      :key="`history-tag-${index}`"
      class="mt-10 flex cursor-pointer items-center justify-center whitespace-nowrap rounded-xl bg-gray-f6 px-18 py-6 text-sm font-normal leading-3"
      @click="() => (modelValue = tag[`${props.itemValue}`])"
    >
      {{ tag[`${props.itemLabel}`] }}
    </div>
  </div>
</template>
<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: { type: [String, Number], required: true },
  items: { type: Array, default: () => [] },
  itemValue: { type: String, default: 'value' },
  itemLabel: { type: String, default: 'label' },
})

const emits = defineEmits(['update:modelValue'])

const modelValue = computed({
  get: () => props.modelValue,
  set: (value) => emits('update:modelValue', value),
})
</script>
