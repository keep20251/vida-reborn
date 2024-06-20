<template>
  <div class="flex flex-col space-y-10">
    <label v-if="label" class="text-left text-base font-normal not-italic leading-md"
      >{{ label }}
      <span v-if="sublabel" class="text-sm font-normal not-italic leading-3 text-gray-57">{{ sublabel }}</span>
    </label>
    <div class="flex flex-col space-y-2">
      <textarea
        v-model="value"
        ref="textarea"
        :placeholder="placeholder"
        :disabled="disabled"
        :style="{ height: resizedHeight || height }"
        class="scrollbar-md w-full shrink-0 appearance-none divide-solid rounded-md border-gray-cc bg-white px-20 py-[0.75rem] text-sm font-normal not-italic text-gray-57 shadow-input outline-none placeholder:text-gray-a3"
        :class="{ 'leading-3': !leading, 'leading-5': leading, 'resize-none': !resize }"
        @keypress.enter="onEnterPress"
      ></textarea>
      <div v-if="errMsg" class="text-left text-sm font-normal not-italic leading-md text-warning">
        {{ errMsg }}
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed, ref } from 'vue'
import { useResizeObserver } from '@vueuse/core'

const props = defineProps({
  label: { type: String },
  sublabel: { type: String },
  modelValue: { type: String, required: true },
  placeholder: { type: String, default: '输入文字...' },
  disabled: { type: Boolean, default: false },
  line: { type: Number, default: 3 },
  leading: { type: Boolean, default: false },
  resize: { type: Boolean, default: false },
  errMsg: { type: String, default: '' },
  disableEnterNewLine: { type: Boolean, default: false },
})
const emits = defineEmits(['update:modelValue', 'keypress:enter', 'keypress:help:enter'])
const value = computed({
  get() {
    return props.modelValue
  },
  set(newValue) {
    emits('update:modelValue', newValue)
  },
})

const textarea = ref(null)
const height = computed(() => {
  // props.leading 為 false -> 12px(font-size) * 1(line-height) / 16(轉成rem) = 0.75
  // props.leading 為 true -> 12px(font-size) + 8px(line-height) / 16(轉成rem) = 1.25
  const lineHeight = props.leading ? 1.25 : 0.75

  // 12px(padding-top) + 12(padding-bottom) / 16(轉成rem) = 1.5
  const padding = 1.5

  return `${props.line * lineHeight + padding}rem`
})
const resizedHeight = ref(null)
useResizeObserver(textarea, (entries) => {
  if (props.resize) {
    resizedHeight.value = entries[0].contentRect.height
  }
})

function onEnterPress(evt) {
  const helpKey = evt.altKey || evt.ctrlKey || evt.shiftKey
  if (props.disableEnterNewLine && helpKey) {
    evt.preventDefault()
  }
  emits(helpKey ? 'keypress:help:enter' : 'keypress:enter')
}
</script>
