<template>
  <div class="flex flex-wrap items-end space-x-10 space-y-15" :class="{ 'justify-center': center }">
    <div
      v-for="option in options"
      :key="option[optionValue]"
      class="cursor-pointer rounded-xl px-18 py-6 text-sm leading-3"
      :class="[
        (Array.isArray(modelValue) ? modelValue.includes(option[optionValue]) : modelValue === option[optionValue])
          ? 'bg-primary text-white'
          : 'bg-gray05',
      ]"
      @click="onClick(option[optionValue])"
    >
      {{ option[optionLabel] }}
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: { type: [Array, Number], required: true },
  options: { type: Array, required: true },
  optionLabel: { type: String, default: 'label' },
  optionValue: { type: String, default: 'value' },
  center: { type: Boolean, default: false },
})

const emits = defineEmits(['update:modelValue'])

function onClick(v) {
  if (Array.isArray(props.modelValue)) {
    const r = [...props.modelValue]
    const index = r.findIndex((o) => o === v)
    if (index === -1) {
      r.push(v)
      r.sort((a, b) => a - b)
    } else {
      r.splice(index, 1)
    }
    emits('update:modelValue', r)
  } else {
    emits('update:modelValue', v)
  }
}
</script>
