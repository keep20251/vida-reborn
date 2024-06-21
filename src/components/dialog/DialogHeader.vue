<template>
  <div
    class="flex flex-col space-y-32"
    :class="{
      'h-[30.5rem] xl:lg:md:h-[37.5rem]': fixedHeight,
      'overflow-y-auto': scrollY,
    }"
  >
    <div class="relative text-center">
      <div v-if="showBack" class="absolute left-0 top-0">
        <button @click="emits('back')">
          <Icon name="back"></Icon>
        </button>
      </div>
      <div v-if="showClose" class="absolute right-0 top-0">
        <button @click="emits('close')">
          <Icon name="close"></Icon>
        </button>
      </div>
      <div class="text-lg font-bold leading-5">{{ title }}</div>
    </div>
    <div class="sm:px-0 md:px-20 lg:px-20 xl:px-20">
      <slot></slot>
    </div>
    <div v-if="$slots['buttons']" class="sm:px-0 md:px-20 lg:px-20 xl:px-20">
      <slot name="buttons"></slot>
    </div>
  </div>
</template>
<script setup>
defineProps({
  title: {
    type: String,
    default: 'Header',
  },
  showBack: {
    type: Boolean,
    default: false,
  },
  showClose: {
    type: Boolean,
    default: true,
  },
  fixedHeight: {
    type: Boolean,
    default: false,
  },
  scrollY: {
    type: Boolean,
    default: false,
  },
})

const emits = defineEmits(['back', 'close'])
</script>
