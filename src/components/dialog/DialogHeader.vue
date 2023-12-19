<template>
  <div class="flex flex-col gap-y-32">
    <div class="relative text-center">
      <div class="absolute left-0 top-0">
        <button @click="emits('back')">
          <Icon name="back" :size="24"></Icon>
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
})

const emits = defineEmits(['back'])
</script>
