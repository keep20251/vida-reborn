<template>
  <div class="h-full">
    <div class="flex space-x-5">
      <div
        v-for="option in options"
        class="flex cursor-pointer items-center justify-center rounded-full bg-gray-f6 px-15 py-5"
        :key="option[optionValue]"
        @click="onClick(option[optionValue])"
      >
        <div
          class="flex items-center text-base leading-md"
          :class="[option[optionValue] === modelValue ? 'font-bold' : 'font-normal']"
        >
          {{ $t(option[optionLabel]) }}
        </div>
      </div>
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
