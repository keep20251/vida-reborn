<template>
  <div class="flex flex-wrap">
    <div
      v-for="(tag, index) in props.items"
      :key="`history-tag-${index}`"
      class="ml-10 mt-10 flex cursor-pointer items-center justify-start whitespace-nowrap rounded-xl bg-gray-f6 px-18 py-6 text-sm font-normal leading-3"
      :class="{
        'bg-primary text-white': modelValueProxy === tag[`${props.itemValue}`] && props.enableActiveTheme,
      }"
      @click="setModelValue(tag)"
    >
      {{ tag[`${props.itemLabel}`] }}
    </div>
  </div>
</template>
<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: { type: [String, Number, Object], required: true },
  items: { type: Array, default: () => [] },
  itemValue: { type: String, default: 'value' },
  itemLabel: { type: String, default: 'label' },
  enableActiveTheme: { type: Boolean, default: false },
})

const emits = defineEmits(['update:modelValue'])

const modelValue = computed({
  get: () => props.modelValue,
  set: (value) => emits('update:modelValue', value),
})

const modelValueProxy = computed(() =>
  typeof modelValue.value === 'object' ? modelValue.value[`${props.itemValue}`] : modelValue.value,
)

const setModelValue = (tag) => {
  return typeof props.modelValue === 'object'
    ? (modelValue.value = tag)
    : (modelValue.value = tag[`${props.itemValue}`])
}
</script>
