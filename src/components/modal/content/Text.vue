<template>
  <div class="mb-20 text-center text-sm font-normal leading-[1.125rem] text-gray66">{{ content }}</div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useModalStore } from '@/store/modal'

const modalStore = useModalStore()
const { content } = storeToRefs(modalStore)
</script>

<style lang="scss" scoped></style>
