<template>
  <div class="flex h-full w-full flex-row justify-center" id="main">
    <Navigator v-show="isDesktop"></Navigator>
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component"></component>
      </keep-alive>
    </router-view>
    <ClientOnly>
      <AuthDialog v-if="authDialog"></AuthDialog>
    </ClientOnly>
  </div>
  <NavigatorMobile v-show="isMobile"></NavigatorMobile>
  <Modal></Modal>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import Navigator from '@comp/layout/Navigator.vue'
import NavigatorMobile from '@comp/layout/NavigatorMobile.vue'
import AuthDialog from '@comp/dialog/AuthDialog.vue'
import Modal from '@comp/modal/index.vue'
import { useAppStore } from '@/store/app'
import { useDialogStore } from '@/store/dialog'
import { loadSeoHead } from '@/utils/init'

const appStore = useAppStore()
const { isDesktop, isMobile } = storeToRefs(appStore)

loadSeoHead()
const { authDialog } = storeToRefs(useDialogStore())
</script>
