<template>
  <div class="flex h-full w-full flex-row justify-center" id="main">
    <Navigator v-if="isDesktop"></Navigator>
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component"></component>
      </keep-alive>
    </router-view>
    <ClientOnly>
      <AuthDialog v-if="authDialog"></AuthDialog>
    </ClientOnly>
  </div>
  <NavigatorMobile v-if="isMobile"></NavigatorMobile>
  <Modal></Modal>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import Navigator from '@comp/layout/Navigator.vue'
import NavigatorMobile from '@comp/layout/NavigatorMobile.vue'
import AuthDialog from '@comp/dialog/AuthDialog.vue'
import Modal from '@comp/modal/index.vue'
import { useAppStore } from '@/store/app'
import { useAccountStore } from '@/store/account'
import { useDialogStore } from '@/store/dialog'
import { useHydrationStore } from '@/store/hydration'
import { onServerClientOnce, onHydration } from '@use/lifecycle'
import useRequest from '@use/request'
import { loadSeoHead } from '@/utils/init'

const appStore = useAppStore()
const { isDesktop, isMobile } = storeToRefs(appStore)

loadSeoHead()
const { authDialog } = storeToRefs(useDialogStore())

const accountStore = useAccountStore()
const { resetUserData } = accountStore
const { isLogin } = storeToRefs(accountStore)

const hydrationStore = useHydrationStore()
const { userData } = storeToRefs(hydrationStore)
onServerClientOnce(async (isSSR) => {
  if (isLogin.value) {
    try {
      const resUserData = await useRequest('User.info', { immediate: true })
      resetUserData(resUserData)

      if (isSSR) {
        userData.value = resUserData
      }
    } catch (e) {
      console.error(e)
    }
  }
})
onHydration(() => {
  if (isLogin.value) {
    // 還原 userData
    resetUserData(userData.value)
  }
})
</script>
