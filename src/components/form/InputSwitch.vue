<template>
  <label class="relative inline-flex w-fit cursor-pointer select-none items-center">
    <input
      type="checkbox"
      class="sr-only"
      :checked="isChecked"
      v-model="modelValue"
      :disabled="disabled"
      @change="handleCheckboxChange"
    />
    <span
      class="slider mr-10 flex h-[20px] w-[35px] items-center rounded-full p-1 pl-3 duration-200"
      :class="{ 'bg-primary': isChecked, 'bg-gray10': !isChecked }"
    >
      <span
        class="dot h-[14px] w-[14px] rounded-full bg-white shadow-inner duration-200"
        :class="{ 'translate-x-15': isChecked }"
      ></span>
    </span>
    <span v-if="label" class="font-size-14 line-height-14 flex items-center font-normal">{{ label }}</span>
  </label>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits, watch } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, default: true },
  label: { type: String, required: false },
  disabled: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue'])

const isChecked = ref(props.modelValue)

watch(
  () => props.value,
  (newValue) => {
    isChecked.value = props.modelValue === newValue
  },
)

const handleCheckboxChange = () => {
  isChecked.value = !isChecked.value
}

const modelValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})
</script>
<style lang="scss" scoped>
.shadow-inner {
  filter: drop-shadow(1px 1px 4px rgba(0, 0, 0, 0.25));
}
</style>
