<template>
  <div class="flex h-full w-full flex-row">
    <div
      v-for="option in options"
      class="flex grow cursor-pointer flex-col items-center justify-center hover:bg-gray05"
      :key="option[optionValue]"
      @click="onClick(option[optionValue])"
    >
      <div class="flex grow items-center">{{ $t(option[optionLabel]) }}</div>
      <div
        class="h-3 w-full rounded-full bg-gray30"
        :class="{ 'bg-primary': option[optionValue] === modelValue }"
      ></div>
    </div>
  </div>
</template>

<script setup>
defineProps({
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
