<template>
  <BaseDialog v-if="authDialog">
    <template #default>
      <keep-alive>
        <component :is="authComponent"></component>
      </keep-alive>
    </template>
  </BaseDialog>
</template>
<script setup>
import { useEventListener } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { useAuthRouteStore } from '@/store/auth-route'
import { useDialogStore } from '@/store/dialog'
import BaseDialog from '@comp/dialog/BaseDialog.vue'

const { authDialog } = storeToRefs(useDialogStore())

const authRoute = useAuthRouteStore()
const { authComponent } = storeToRefs(authRoute)
const { close } = authRoute

// 快捷鍵關閉登入彈窗 ctrl + shift + C
useEventListener('keypress', (evt) => {
  if (evt.ctrlKey && evt.shiftKey && ['c', 'C'].includes(evt.key)) {
    close()
  }
})
</script>
