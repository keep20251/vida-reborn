<template>
  <div class="flex w-full flex-col space-y-20">
    <div class="flex w-full flex-col space-y-10">
      <div class="text-base font-normal leading-md">{{ props.title }}</div>
      <div class="flex min-h-[12.5rem] items-center justify-center rounded-md bg-gray03">{{ props.pictureInfo }}</div>
    </div>
    <Button contrast>{{ props.buttonText }}</Button>
  </div>
</template>
<script setup>
import Button from '@comp/common/Button.vue'

const props = defineProps({
  title: { type: String, required: true },
  pictureInfo: { type: String, required: true },
  buttonText: { type: String, required: true },
})
</script>
