<template>
  <div class="flex items-center">
    <input
      type="radio"
      :id="id"
      :value="value"
      :name="name"
      :checked="isChecked"
      :disabled="disabled"
      @change="handleChange"
      class="relative h-15 w-15 cursor-pointer select-none appearance-none rounded-[0.25rem] bg-[#d9d9d9] outline-none disabled:border-solid disabled:border-[#d6d6d6] disabled:bg-gray-a3 [&:checked]:bg-primary before:[&:checked]:absolute before:[&:checked]:left-[0.275rem] before:[&:checked]:top-[0.09rem] before:[&:checked]:block before:[&:checked]:h-[0.6rem] before:[&:checked]:w-[0.3625rem] before:[&:checked]:rotate-45 before:[&:checked]:rounded-[0.0625rem] before:[&:checked]:border-b-[0.15rem] before:[&:checked]:border-l-[0] before:[&:checked]:border-r-[0.15rem] before:[&:checked]:border-solid before:[&:checked]:border-white before:[&:checked]:border-t-[1] disabled:[&:checked]:bg-gray-a3"
    />
    <label :for="id" v-if="label" class="ml-10 text-base font-normal leading-md">{{ label }}</label>
    <InputWrap v-if="includeInputWrap" :placeholder="placeholder" v-model="wrapValue" class="ml-10"></InputWrap>
  </div>
</template>

<script setup>
import { defineEmits, ref, watch } from 'vue'
import InputWrap from '@comp/form/InputWrap.vue'

const props = defineProps({
  id: { type: String, required: true },
  label: { type: String, required: true },
  value: { type: [String, Number, Boolean], required: true },
  name: { type: String, required: true },
  modelValue: { type: [String, Number, Boolean], required: true },
  disabled: { type: Boolean, default: false },
  placeholder: { type: String, default: '输入文字...' },
  includeInputWrap: { type: Boolean, default: false },
})

const emits = defineEmits(['update:modelValue'])

const isChecked = ref(props.modelValue === props.value)
const wrapValue = ref('')

const handleChange = () => {
  if (props.includeInputWrap && !isChecked.value) {
    return
  }
  emits('update:modelValue', props.value)
}

watch(wrapValue, (newValue) => {
  if (props.includeInputWrap) {
    emits('update:modelValue', newValue)
  }
})
</script>
