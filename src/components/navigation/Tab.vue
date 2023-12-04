<template>
  <div class="flex h-full w-full flex-row">
    <div
      v-for="option in options"
      class="hover:bg-gray05 flex grow cursor-pointer flex-col items-center justify-center"
      :key="option[optionValue]"
      @click="onClick(option[optionValue])"
    >
      <div class="flex grow items-center">{{ $t(option[optionLabel]) }}</div>
      <div
        class="bg-gray30 h-3 w-full rounded-full"
        :class="{ 'bg-primary': option[optionValue] === modelValue }"
      ></div>
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
