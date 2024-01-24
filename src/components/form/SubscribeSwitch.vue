<template>
  <div
    class="flex h-74 w-full items-center justify-between rounded-xl px-20 py-18 shadow-[0_0_0.375rem_0_rgba(0,0,0,0.15)inset]"
  >
    <div class="flex flex-col">
      <p class="pa-0">{{ props.title }}</p>
      <p class="pa-0">
        <span>${{ props.price }}</span> / 30 days
      </p>
    </div>
    <div class="flex flex-row space-x-20">
      <p>查看</p>
      <InputSwitch v-model="modelValue"></InputSwitch>
    </div>
  </div>
</template>
<script setup>
import { computed } from 'vue'
import InputSwitch from '@comp/form/InputSwitch.vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: 'Simple Tier' },
  price: { type: [String, Number], default: 99 },
})

const emits = defineEmits(['update:modelValue'])

const modelValue = computed({
  get: () => props.modelValue,
  set: (value) => emits('update:modelValue', value),
})
</script>
