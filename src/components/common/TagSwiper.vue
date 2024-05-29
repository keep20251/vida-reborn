<template>
  <div class="relative w-full" ref="outerElment">
    <div class="flex w-full max-w-full flex-row space-x-10 overflow-x-auto" ref="scrollElement">
      <Tag
        v-for="item in props.items"
        :key="`tag-${item[`${props.itemValue}`]}`"
        :value="item[`${props.itemValue}`]"
        :label="item[`${itemLabel}`]"
        :active="modelValue === item[`${props.itemValue}`]"
        @click="onTagClick(item)"
        ref="itemRefs"
      ></Tag>
    </div>
    <div v-if="false">
      <div
        v-show="!arrivedState.left && showArrow"
        class="w-[calc(2rem + 2px) ] absolute left-0 top-0 z-50 flex h-full cursor-pointer items-center justify-center"
        @click="() => (x -= 250)"
      >
        <Icon name="back" size="16" style="scale: -1"></Icon>
      </div>
      <div
        v-show="!arrivedState.right && showArrow"
        class="w-[calc(2rem + 2px) ] absolute right-0 top-0 z-50 flex h-full cursor-pointer items-center justify-center"
        @click="() => (x += 250)"
      >
        <Icon name="back" size="16"></Icon>
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed, onActivated, onMounted, ref, watch } from 'vue'
import { useScroll } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/store/app'
import Tag from './Tag.vue'

const { isDesktop } = storeToRefs(useAppStore())

const props = defineProps({
  modelValue: { type: [String, Number], default: '' },
  items: { type: Array, required: true },
  itemValue: { type: String, default: 'value' },
  itemLabel: { type: String, default: 'label' },
  checker: { type: Function, required: false },
})

const emit = defineEmits(['update:modelValue', 'click'])

const modelValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const outerElment = ref(null)
const scrollElement = ref(null)
const showArrow = computed(() => scrollElement.value?.scrollWidth > outerElment.value?.clientWidth + 32)

const { x, arrivedState } = useScroll(scrollElement, { behavior: 'smooth' })
function normalizeArrivedState() {
  arrivedState.left = true
  arrivedState.right = false
}

const itemRefs = ref([])
const activeIndex = computed(() => props.items.findIndex((item) => item[`${props.itemValue}`] === modelValue.value))

function shiftToActiveIndex() {
  let shiftX = 0
  for (let i = 0; i < itemRefs.value.length; i++) {
    if (i >= activeIndex.value) break
    shiftX += itemRefs.value[i].$el.scrollWidth
  }
  scrollElement.value.scrollLeft = shiftX
}

onMounted(() => {
  normalizeArrivedState()
  setTimeout(() => shiftToActiveIndex(), 500)
  console.log('outerElment', outerElment.value.clientWidth, scrollElement.value.clientWidth)
})
onActivated(() => {
  normalizeArrivedState()
  setTimeout(() => shiftToActiveIndex(), 500)
})

const index = computed(() => props.items.findIndex((item) => item[`${props.itemValue}`] === modelValue.value))
watch(index, () => (index.value >= props.items.length / 2 ? (x.value = x.value + 1000) : void 0), { immediate: true })

function onTagClick(item) {
  emit('click', item)
  if (props.checker && !props.checker(item)) return
  modelValue.value = item[`${props.itemValue}`]
}
</script>
<style scoped lang="scss">
.tag-container {
  position: relative;
  width: 100%;

  .scroll {
    display: flex;
    width: 100%;
    max-width: 100%;
    overflow-x: auto;
  }

  .arrow {
    position: absolute;
    z-index: 50;
    top: 0;

    display: flex;
    justify-content: center;
    align-items: center;

    width: calc(2rem + 2px);
    height: 100%;

    border-radius: 1.875rem 0rem 0rem 1.875rem;
    background: rgba(24, 25, 37, 0.5);

    backdrop-filter: blur(9px);

    cursor: pointer;

    &-left {
      left: 0;
      border-radius: 0px 30px 30px 0px;
    }

    &-right {
      right: 0;
      border-radius: 30px 0px 0px 30px;
    }
  }
}
</style>
