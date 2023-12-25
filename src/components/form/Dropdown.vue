<template>
  <div class="relative cursor-pointer">
    <div ref="dropdown" class="flex items-center justify-between bg-white" :class="[style]" @click="onDropdownClick">
      <div class="text-sm leading-[0.875rem]">
        {{ $t(options.find((o) => o[optionValue] === modelValue)[optionLabel]) }}
      </div>
      <Icon name="dropdown" size="8" class="transition-transform" :class="{ 'rotate-180': open }"></Icon>
    </div>
    <div
      class="scrollbar absolute z-10 flex max-h-[300px] w-full flex-col overflow-auto rounded-[0.9375rem] bg-white shadow-[1px_1px_5px_0px_rgba(0,0,0,0.1)] transition-transform"
      :class="[{ 'scale-y-0': !open, 'scale-y-100': open }, optionStyle]"
    >
      <div
        v-for="option in options"
        class="py-10 pl-15 text-sm leading-[0.875rem] first:rounded-t-[0.9375rem] last:rounded-b-[0.9375rem] hover:bg-[#F1F1FF]"
        :class="{ 'bg-[#F1F1FF]': option[optionValue] === modelValue }"
        :key="option[optionValue]"
        @click="onOptionClick(option[optionValue])"
      >
        {{ $t(option[optionLabel]) }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useWindowSize, useEventListener } from '@vueuse/core'

const props = defineProps({
  modelValue: { required: true },
  options: { type: Array, required: true },
  optionLabel: { type: String, default: 'label' },
  optionValue: { type: String, default: 'value' },
  inset: { type: Boolean, default: false },
})

const emits = defineEmits(['update:modelValue'])

const style = computed(() => {
  if (props.inset) {
    return 'h-36 px-20 py-12 rounded-[1.125rem] border-gray20 shadow-[inset_0_-1px_8px_0_rgba(0,0,0,0.1)]'
  }
  return `rounded-[0.9375rem] px-15 py-5 shadow-[0_0_3px_0_rgba(0,0,0,0.1)]`
})

const dropdown = ref(null)
const open = ref(false)
const openPosition = ref('bottom')
const optionStyle = computed(() => {
  switch (openPosition.value) {
    case 'bottom':
      return 'top-30 origin-top'
    case 'top':
      return 'bottom-30 origin-bottom'
    default:
      return 'top-30 origin-top'
  }
})

function onDropdownClick() {
  if (!open.value) {
    const { height } = useWindowSize()
    const { top, bottom } = dropdown.value.getBoundingClientRect()
    const [topGap, bottomGap] = [top, height.value - bottom]
    openPosition.value = bottomGap < 300 && topGap > bottomGap ? 'top' : 'bottom'
  }
  open.value = !open.value
}

function onOptionClick(v) {
  open.value = false
  emits('update:modelValue', v)
}

onMounted(() => {
  useEventListener('click', ({ target }) => {
    if (!dropdown.value.parentNode.contains(target)) {
      open.value = false
    }
  })
})
</script>
