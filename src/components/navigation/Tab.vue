<template>
  <div class="relative h-full">
    <div class="flex h-full w-full flex-row space-x-2">
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
    <div v-if="feature" class="pointer-events-none absolute right-8 top-0 flex h-full items-center">
      <div class="pointer-events-auto h-20 w-20 cursor-pointer" @click.stop="$emit('feature')">
        <Icon :name="feature" size="20"></Icon>
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
  feature: { type: String },
})

const emits = defineEmits(['update:modelValue', 'feature'])

function onClick(v) {
  emits('update:modelValue', v)
}
</script>
