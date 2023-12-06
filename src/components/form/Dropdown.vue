<template>
  <div class="relative cursor-pointer">
    <div
      ref="dropdown"
      class="flex items-center justify-between rounded-[0.9375rem] bg-white px-15 py-5"
      @click="onDropdownClick"
    >
      <div class="text-sm leading-[0.875rem]">
        {{ options.find((o) => o[optionValue] === modelValue)[optionLabel] }}
      </div>
      <Icon name="dropdown" :size="8" class="transition-transform" :class="{ 'rotate-180': open }"></Icon>
    </div>
    <div
      class="max-h-300 absolute flex w-full flex-col overflow-auto rounded-[0.9375rem] bg-white shadow-[1px_1px_5px_0px_rgba(0,0,0,0.1)] transition-transform"
      :class="[{ 'scale-y-0': !open, 'scale-y-100': open }, optionStyle]"
    >
      <div
        v-for="option in options"
        class="py-10 pl-15 text-sm leading-[0.875rem] first:rounded-t-[0.9375rem] last:rounded-b-[0.9375rem] hover:bg-[#F1F1FF]"
        :class="{ 'bg-[#F1F1FF]': option[optionValue] === modelValue }"
        :key="option[optionValue]"
        @click="onOptionClick(option[optionValue])"
      >
        {{ option[optionLabel] }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useWindowSize, useEventListener } from '@vueuse/core'

defineProps({
  modelValue: { required: true },
  options: { type: Array, required: true },
  optionLabel: { type: String, default: 'label' },
  optionValue: { type: String, default: 'value' },
})

const emits = defineEmits(['update:modelValue'])

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
    while (target !== document.body) {
      if (target === dropdown.value) {
        return
      }
      target = target.parentElement
    }
    if (open.value) {
      open.value = false
    }
  })
})
</script>
