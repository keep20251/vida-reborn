<template>
  <div class="flex h-full w-full flex-row justify-center" id="main">
    <Navigator></Navigator>
    <router-view></router-view>
    <ClientOnly>
      <AuthDialog v-if="authDialog"></AuthDialog>
    </ClientOnly>
  </div>
  <!-- <NavigatorMobile></NavigatorMobile> -->
</template>

<script setup>
import Navigator from '@/components/layout/Navigator.vue'
// import NavigatorMobile from '@/components/layout/NavigatorMobile.vue'
import AuthDialog from '@/components/dialog/AuthDialog.vue'
import { useDialogStore } from '@/store/dialog'
import { useAccountStore } from '@/store/account'
import { storeToRefs } from 'pinia'
import { onMounted, watch } from 'vue'

const { authDialog } = storeToRefs(useDialogStore())
const { isLogin } = storeToRefs(useAccountStore())

onMounted(() => {
  watch(
    isLogin,
    (newValue) => {
      console.log('isLogin', newValue)
      if (!newValue) authDialog.value = true
    },
    { immediate: true },
  )
})
</script>
