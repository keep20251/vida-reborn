<template>
  <div class="flex h-[30.5rem] flex-col space-y-32 overflow-y-scroll xl:lg:md:h-[37.5rem]">
    <div class="relative text-center">
      <div v-if="props.showBack" class="absolute left-0 top-0">
        <button @click="emits('back')">
          <Icon name="back"></Icon>
        </button>
      </div>
      <div v-if="props.showClose" class="absolute right-0 top-0">
        <button @click="emits('close')">
          <Icon name="close"></Icon>
        </button>
      </div>
      <div class="text-lg font-bold leading-5">{{ props.title }}</div>
    </div>
    <div class="sm:px-0 md:px-20 lg:px-20 xl:px-20">
      <slot></slot>
    </div>
  </div>
</template>
<script setup>
const props = defineProps({
  title: {
    type: String,
    default: 'Header',
  },
  showBack: {
    type: Boolean,
    default: true,
  },
  showClose: {
    type: Boolean,
    default: true,
  },
})

const emits = defineEmits(['back', 'close'])
</script>
