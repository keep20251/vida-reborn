<template>
  <div class="flex h-full w-full flex-row justify-center" id="main">
    <Navigator></Navigator>
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component"></component>
      </keep-alive>
    </router-view>
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

const { authDialog } = storeToRefs(useDialogStore())
</script>
