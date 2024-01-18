<template>
  <div class="flex flex-col space-y-32">
    <div class="relative text-center">
      <div v-if="props.showBack" class="absolute left-0 top-0">
        <button @click="emits('back')">
          <Icon name="back"></Icon>
        </button>
      </div>
      <div v-else class="absolute right-0 top-0">
        <button @click="emits('close')">
          <Icon name="close"></Icon>
        </button>
      </div>
      <div>{{ props.title }}</div>
    </div>
    <slot></slot>
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
})

const emits = defineEmits(['back', 'close'])
</script>
