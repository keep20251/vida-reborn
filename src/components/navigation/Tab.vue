<template>
  <div class="flex h-full w-full flex-row">
    <div
      v-for="option in options"
      class="flex grow cursor-pointer flex-col items-center justify-center hover:bg-gray05"
      :key="option[optionValue]"
      @click="onClick(option[optionValue])"
    >
      <div class="leading-md flex grow items-center text-base font-bold">{{ $t(option[optionLabel]) }}</div>
      <div
        class="h-3 w-full rounded-full"
        :class="[option[optionValue] === modelValue ? 'bg-black' : 'bg-gray30']"
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
