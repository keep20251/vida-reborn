<template>
  <div class="flex flex-col space-y-10">
    <label v-if="label" class="text-left text-base font-normal not-italic leading-md"
      >{{ label }}
      <span v-if="sublabel" class="text-gray-57 text-sm font-normal not-italic leading-3">{{ sublabel }}</span>
    </label>
    <div class="flex flex-col space-y-2">
      <textarea
        v-model="value"
        :placeholder="placeholder"
        :disabled="disabled"
        :style="{ height }"
        class="text-gray-57 placeholder:text-gray-a3 border-gray-cc w-full shrink-0 resize-none divide-solid rounded-md bg-white px-20 py-[0.75rem] text-sm font-normal not-italic leading-3 shadow-[0_-0.0625rem_0.5rem_0_rgba(0,0,0,0.1)inset] outline-none"
      ></textarea>
      <div v-if="errMsg" class="text-left text-sm font-normal not-italic leading-md text-warning">
        {{ errMsg }}
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed } from 'vue'

const props = defineProps({
  label: { type: String },
  sublabel: { type: String },
  modelValue: { type: String, required: true },
  placeholder: { type: String, default: '输入文字...' },
  disabled: { type: Boolean, default: false },
  line: { type: Number, default: 3 },
  errMsg: { type: String, default: '' },
})
const emits = defineEmits(['update:modelValue'])
const value = computed({
  get() {
    return props.modelValue
  },
  set(newValue) {
    emits('update:modelValue', newValue)
  },
})
const height = computed(() => {
  // 12px(font-size) * 1(line-height) / 16(轉成rem) = 0.75
  // 12px(padding-top) + 12(padding-bottom) / 16(轉成rem) = 1.5
  return `${props.line * 0.75 + 1.5}rem`
})
</script>
