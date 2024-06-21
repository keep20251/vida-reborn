<template>
  <div class="flex flex-wrap items-end gap-x-10 gap-y-15" :class="{ 'justify-center': center }">
    <div
      v-for="option in options"
      :key="option[optionValue]"
      class="flex cursor-pointer items-center space-x-10 rounded-xl px-18 py-6 text-sm leading-3"
      :class="[isOptionPicked(option) ? 'bg-primary text-white' : 'bg-gray-f6']"
      @click="onPick(option[optionValue])"
    >
      <span>{{ $t(option[optionLabel]) }}</span>
      <Icon
        v-if="canDelete"
        :name="isOptionPicked(option) ? 'closeWhite' : 'close'"
        size="10"
        @click.stop="onDelete(option[optionValue])"
      ></Icon>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: { type: [Array, Number], required: true },
  options: { type: Array, required: true },
  optionLabel: { type: String, default: 'label' },
  optionValue: { type: String, default: 'value' },
  center: { type: Boolean, default: false },
  canPickNone: { type: Boolean, default: false },
  canDelete: { type: Boolean, default: false },
})

const emits = defineEmits(['update:modelValue', 'delete'])

function onPick(v) {
  if (Array.isArray(props.modelValue)) {
    const r = [...props.modelValue]
    const index = r.findIndex((o) => o === v)
    if (index === -1) {
      r.push(v)
      r.sort((a, b) => a - b)
    } else if (props.canPickNone || r.length > 1) {
      r.splice(index, 1)
    }
    emits('update:modelValue', r)
  } else {
    emits('update:modelValue', v)
  }
}
function onDelete(v) {
  emits('delete', v)
}

function isOptionPicked(option) {
  return Array.isArray(props.modelValue)
    ? props.modelValue.includes(option[props.optionValue])
    : props.modelValue === option[props.optionValue]
}
</script>
