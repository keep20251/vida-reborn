<template>
  <BaseDialog v-if="isOpen" size="sm">
    <template #default>
      <keep-alive>
        <component :is="activeComponent" />
      </keep-alive>
    </template>
  </BaseDialog>
</template>
<script setup>
import { storeToRefs } from 'pinia'
import { usePaymentStore } from '@/store/payment'
import BaseDialog from './BaseDialog.vue'

const { isOpen, activeComponent } = storeToRefs(usePaymentStore())
</script>
