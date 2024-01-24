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
import { storeToRefs } from 'pinia'
import { useAuthRouteStore } from '@/store/auth-route'
import BaseDialog from '@comp/dialog/BaseDialog.vue'

const authRoute = useAuthRouteStore()
const { authComponent } = storeToRefs(authRoute)
</script>
