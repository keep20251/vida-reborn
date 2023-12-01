<template>
  <div class="flex h-full w-full flex-row">
    <div
      v-for="option in options"
      class="flex grow cursor-pointer items-center justify-center hover:bg-slate-300"
      :class="{ 'bg-cyan-800': option[optionValue] === modelValue }"
      :key="option[optionValue]"
      @click="onClick(option[optionValue])"
    >
      <div>{{ $t(option[optionLabel]) }}</div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: { required: true },
  options: { type: Array, required: true },
  optionLabel: { type: String, default: 'label' },
  optionValue: { type: String, default: 'value' },
})

const emits = defineEmits(['update:modelValue'])

function onClick(v) {
  emits('update:modelValue', v)
}
</script>

<style lang="scss" scoped></style>
