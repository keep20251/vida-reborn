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
import { storeToRefs } from 'pinia'
import { useCookieLocale } from '@use/cookie/locale'

useCookieLocale().initial()

const { authDialog } = storeToRefs(useDialogStore())
</script>
