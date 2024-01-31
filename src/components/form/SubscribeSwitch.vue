<template>
  <div
    class="flex h-74 w-full items-center justify-between rounded-xl px-20 py-18 shadow-[0_0_0.375rem_0_rgba(0,0,0,0.15)inset]"
  >
    <div class="flex flex-col">
      <p class="pa-0">{{ item.name }}</p>
      <p class="pa-0">
        <span>${{ item.price }}</span> / {{ $t('unit.day', { days: item.expire_days }) }}
      </p>
    </div>
    <div class="flex flex-row space-x-20">
      <p>{{ $t('common.check') }}</p>
      <InputSwitch v-model="modelValue"></InputSwitch>
    </div>
  </div>
</template>
<script setup>
import { computed } from 'vue'
import InputSwitch from '@comp/form/InputSwitch.vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  item: { type: Object, required: true },
})

const emits = defineEmits(['update:modelValue'])

const modelValue = computed({
  get: () => props.modelValue,
  set: (value) => emits('update:modelValue', value),
})
</script>
