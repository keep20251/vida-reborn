<template>
  <div class="relative cursor-pointer">
    <div ref="dropdown" class="flex items-center justify-between bg-white" :class="[style]" @click="onDropdownClick">
      <div class="text-base leading-md">
        {{ props.disableTranslate ? selectedOptionLabel : $t(selectedOptionLabel) }}
      </div>
      <Icon name="dropdown" size="8" class="transition-transform" :class="{ 'rotate-180': open }"></Icon>
    </div>
    <div
      v-bind="containerProps"
      class="scrollbar absolute z-10 flex max-h-[300px] w-full flex-col overflow-auto rounded-xl bg-white shadow-[1px_1px_5px_0px_rgba(0,0,0,0.1)] transition-transform"
      :class="[{ 'scale-y-0': !open, 'scale-y-100': open }, optionStyle]"
    >
      <div v-bind="wrapperProps">
        <div
          v-for="item in list"
          :key="item.index"
          class="py-10 pl-15 text-base leading-md first:rounded-t-xl last:rounded-b-xl hover:bg-[#F1F1FF]"
          :class="{ 'bg-[#F1F1FF]': item.data[optionValue] === modelValue }"
          @click="onOptionClick(item.data[optionValue])"
        >
          {{ props.disableTranslate ? item.data[optionLabel] : $t(item.data[optionLabel]) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useEventListener, useVirtualList, useWindowSize } from '@vueuse/core'

const props = defineProps({
  modelValue: { required: true },
  options: { type: Array, required: true },
  optionLabel: { type: String, default: 'label' },
  optionValue: { type: String, default: 'value' },
  inset: { type: Boolean, default: false },
  disableTranslate: { type: Boolean, default: true },
})

const computedOptions = computed(() => props.options)
const { list, containerProps, wrapperProps } = useVirtualList(computedOptions, { itemHeight: 14 })

const emits = defineEmits(['update:modelValue'])

const style = computed(() => {
  if (props.inset) {
    return 'h-36 px-20 py-12 rounded-2xl border-gray-cc shadow-[inset_0_-1px_8px_0_rgba(0,0,0,0.1)]'
  }
  return `px-15 py-5 rounded-xl shadow-[0_0_3px_0_rgba(0,0,0,0.1)]`
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
const selectedOptionLabel = computed(() => {
  if (props.options.length === 0) return 'undefined'
  return props.options.find((o) => o[props.optionValue] === props.modelValue)[props.optionLabel]
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
