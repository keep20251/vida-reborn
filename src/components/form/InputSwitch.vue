<template>
  <label class="relative inline-flex w-fit cursor-pointer select-none items-center">
    <input type="checkbox" class="hidden" :checked="isChecked" v-model="isChecked" :disabled="disabled" />
    <span
      class="slider mr-10 flex h-20 w-35 items-center rounded-full p-1 pl-3 duration-200"
      :class="{ 'bg-primary': isChecked, 'bg-gray10': !isChecked, 'bg-gray36': disabled }"
    >
      <span
        class="dot h-14 w-14 rounded-full bg-white drop-shadow-[1px_1px_4px_rgba(0,0,0,0.25)] duration-200"
        :class="{ 'translate-x-15': isChecked }"
      ></span>
    </span>
    <span v-if="label" class="flex items-center text-sm font-normal leading-[0.875rem]">{{ label }}</span>
  </label>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  label: { type: String, required: false },
  disabled: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue'])

const isChecked = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})
</script>
<style lang="scss" scoped></style>
