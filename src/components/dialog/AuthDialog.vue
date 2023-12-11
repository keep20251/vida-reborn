<template>
  <BaseDialog>
    <template #default>
      <!-- <div class="m-100 mx-20 w-full max-w-[353px] rounded-xl bg-white"> -->
      <keep-alive>
        <component :is="authComponent"></component>
      </keep-alive>
      <!-- </div> -->
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
