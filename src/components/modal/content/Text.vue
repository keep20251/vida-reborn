<template>
  <div class="mb-20 text-center text-sm font-normal leading-lg text-gray-57" :class="[contentClass]">
    {{ content }}
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useModalStore } from '@/store/modal'

const modalStore = useModalStore()
const { content, contentClass } = storeToRefs(modalStore)
</script>
