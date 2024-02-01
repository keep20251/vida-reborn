<template>
  <div>
    <ProgressBar :model-value="content?.progress" size="lg"></ProgressBar>
  </div>
</template>
<script setup>
import { storeToRefs } from 'pinia'
import { useModalStore } from '@/store/modal'
import ProgressBar from '@comp/progress/ProgressBar.vue'

const { content } = storeToRefs(useModalStore())
</script>
