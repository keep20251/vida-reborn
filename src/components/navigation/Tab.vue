<template>
  <div class="h-full">
    <div v-if="!!isBasicTab" class="flex h-full w-full flex-row space-x-2">
      <div
        v-for="option in options"
        class="flex grow cursor-pointer flex-col items-center justify-center hover:bg-gray-f6"
        :key="option[optionValue]"
        @click="onClick(option[optionValue])"
      >
        <div
          class="flex grow items-center text-base leading-md"
          :class="[option[optionValue] === modelValue ? 'font-bold' : 'font-normal']"
        >
          {{ $t(option[optionLabel]) }}
        </div>
        <div
          class="h-2 w-full rounded-full"
          :class="[option[optionValue] === modelValue ? 'bg-black' : 'bg-gray-a3']"
        ></div>
      </div>
    </div>
    <div v-if="!!isBtnTab" class="flex space-x-5">
      <div
        v-for="option in options"
        class="flex cursor-pointer items-center justify-center rounded-full bg-gray-f6 px-15 py-5 hover:bg-gray-f6"
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
  isBasicTab: { type: Boolean, default: true },
  isBtnTab: { type: Boolean, default: false },
})

const emits = defineEmits(['update:modelValue'])

function onClick(v) {
  emits('update:modelValue', v)
}
</script>
