<template>
  <div class="flex flex-col space-y-10">
    <label v-if="label" class="text-left text-base font-normal not-italic leading-md"
      >{{ label }}
      <span v-if="sublabel" class="text-sm font-normal not-italic leading-3 text-gray-57">{{ sublabel }}</span>
    </label>
    <div class="flex flex-col space-y-2">
      <textarea
        v-model="value"
        :placeholder="placeholder"
        :disabled="disabled"
        :style="{ height }"
        class="w-full shrink-0 resize-none appearance-none divide-solid rounded-md border-gray-cc bg-white px-20 py-[0.75rem] text-sm font-normal not-italic leading-3 text-gray-57 shadow-input outline-none placeholder:text-gray-a3"
        @keypress.enter="onEnterPress"
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
  disableEnterNewLine: { type: Boolean, default: false },
})
const emits = defineEmits(['update:modelValue', 'keypress:enter', 'keypress:alt:enter'])
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

function onEnterPress(evt) {
  if (props.disableEnterNewLine && !evt.altKey) {
    evt.preventDefault()
  }
  emits(evt.altKey ? 'keypress:alt:enter' : 'keypress:enter')
}
</script>
