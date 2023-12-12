<template>
  <BaseDialog>
    <template #default>
      <keep-alive>
        <component :is="authComponent"></component>
      </keep-alive>
    </template>
  </BaseDialog>
</template>
<script setup>
import BaseDialog from '@/components/dialog/BaseDialog.vue'
import { useAuthRouteStore } from '@/store/auth-route'
import { storeToRefs } from 'pinia'

const authRoute = useAuthRouteStore()
const { authComponent } = storeToRefs(authRoute)
</script>
