<template>
  <div class="flex h-full w-full flex-row justify-center" id="main">
    <Navigator v-if="isDesktop"></Navigator>
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component"></component>
      </keep-alive>
    </router-view>
    <ClientOnly>
      <CookieBanner></CookieBanner>
      <AuthDialog v-if="authDialog"></AuthDialog>
      <Modal></Modal>
      <MinePrvwBanner v-if="route.name === 'mine-profile-prvw'"></MinePrvwBanner
    ></ClientOnly>
  </div>
  <NavigatorMobile v-if="isMobile"></NavigatorMobile>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAccountStore } from '@/store/account'
import { useAppStore } from '@/store/app'
import { useDialogStore } from '@/store/dialog'
import { useHydrationStore } from '@/store/hydration'
import CookieBanner from '@comp/banner/CookieBanner.vue'
import MinePrvwBanner from '@comp/banner/MinePrvwBanner.vue'
import AuthDialog from '@comp/dialog/AuthDialog.vue'
import Navigator from '@comp/layout/Navigator.vue'
import NavigatorMobile from '@comp/layout/NavigatorMobile.vue'
import Modal from '@comp/modal/index.vue'
import { onHydration, onServerClientOnce } from '@use/lifecycle'
import useRequest from '@use/request'
import { loadSeoHead } from '@/utils/init'

const route = useRoute()
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
