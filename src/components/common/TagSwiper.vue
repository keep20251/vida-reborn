<template>
  <div class="relative w-full" ref="outerElment">
    <div class="none-scrollbar flex w-full max-w-full flex-row space-x-10 overflow-x-auto" ref="scrollElement">
      <Tag
        v-for="(item, index) in props.items"
        :key="index"
        :value="item[`${props.itemValue}`]"
        :label="item[`${itemLabel}`]"
        :active="modelValue === item[`${props.itemValue}`]"
        :disabled="!item[`${itemActive}`]"
        @click="onTagClick(item)"
        ref="itemRefs"
      ></Tag>
    </div>
    <div v-if="isDesktop">
      <div
        v-show="showLeft"
        class="absolute left-0 top-0 z-50 flex h-full w-24 cursor-pointer items-center justify-center rounded-r-xl bg-black bg-opacity-40 backdrop-blur-sm"
        @click="moveToLeft"
      >
        <Icon name="backWhite" size="16"></Icon>
      </div>
      <div
        v-show="showRight"
        class="absolute right-0 top-0 z-50 flex h-full w-24 cursor-pointer items-center justify-center rounded-l-xl bg-black bg-opacity-40 backdrop-blur-sm"
        @click="moveToRight"
      >
        <Icon name="backWhite" size="16" class="-scale-x-100"></Icon>
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed, onActivated, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/store/app'
import { useHorizontalScroll } from '@/compositions/sensor/horizontal-scroll'
import Tag from './Tag.vue'

const { isDesktop } = storeToRefs(useAppStore())

const props = defineProps({
  modelValue: { type: [String, Number], default: '' },
  items: { type: Array, required: true },
  itemValue: { type: String, default: 'value' },
  itemLabel: { type: String, default: 'label' },
  itemActive: { type: String, default: 'active' },
  checker: { type: Function, required: false },
})

const emit = defineEmits(['update:modelValue', 'click'])

const modelValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const outerElment = ref(null)
const scrollElement = ref(null)
const itemRefs = ref([])
const activeIndex = computed(() => props.items.findIndex((item) => item[`${props.itemValue}`] === modelValue.value))

const { showLeft, showRight, normalizeToLeft, moveToItem, moveToLeft, moveToRight } = useHorizontalScroll(
  outerElment,
  scrollElement,
  itemRefs,
)

onMounted(() => {
  normalizeToLeft()
  setTimeout(() => moveToItem(activeIndex.value), 500)
})
onActivated(() => {
  normalizeToLeft()
  setTimeout(() => moveToItem(activeIndex.value), 500)
})

function onTagClick(item) {
  emit('click', item)
  if (item[`${props.itemActive}`] === false) return
  if (props.checker && !props.checker(item)) return
  modelValue.value = item[`${props.itemValue}`]
}
</script>
