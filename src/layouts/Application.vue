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
      <FileSelectDialog v-if="fileSelectDialog"></FileSelectDialog>
      <SubPlanDialog v-if="subPlanDialog"></SubPlanDialog>
      <Subscriptions v-if="subscriptionDialog"></Subscriptions>
      <ReportBlockPicker v-if="reportBlockDialog"></ReportBlockPicker>

      <Modal></Modal>
      <MinePrvwBanner v-if="route.name === 'mine-profile-prvw'"></MinePrvwBanner>
      <PopupMessage></PopupMessage>
    </ClientOnly>
  </div>
  <NavigatorMobile v-if="isMobile"></NavigatorMobile>

  <!-- IM 連線狀態 -->
  <div
    v-if="isDev"
    class="fixed bottom-4 left-4 z-50 h-12 w-12 cursor-pointer rounded-full"
    :class="{ 'bg-emerald-500': isOpen, 'bg-red-500': isClose, 'bg-amber-500': isConnecting }"
    :title="isOpen ? '連線成功' : isClose ? '未連線' : isConnecting ? '連線中...' : ''"
  ></div>
</template>

<script setup>
import { v4 as uuidv4 } from 'uuid'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useLocalStorage } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { useAccountStore } from '@/store/account'
import { useAppStore } from '@/store/app'
import { useDialogStore } from '@/store/dialog'
import { useHydrationStore } from '@/store/hydration'
import { useModalStore } from '@/store/modal'
import CookieBanner from '@comp/banner/CookieBanner.vue'
import MinePrvwBanner from '@comp/banner/MinePrvwBanner.vue'
import AuthDialog from '@comp/dialog/AuthDialog.vue'
import FileSelectDialog from '@comp/dialog/FileSelectDialog.vue'
import PopupMessage from '@comp/dialog/PopupMessage.vue'
import ReportBlockPicker from '@comp/dialog/ReportBlockPicker.vue'
import SubPlanDialog from '@comp/dialog/SubPlanDialog.vue'
import Subscriptions from '@comp/dialog/Subscriptions.vue'
import Navigator from '@comp/layout/Navigator.vue'
import NavigatorMobile from '@comp/layout/NavigatorMobile.vue'
import Modal from '@comp/modal/index.vue'
import { onHydration, onServerClientOnce } from '@use/lifecycle'
import useRequest from '@use/request'
import { useCookie } from '@use/utils/cookie'
import { COOKIE_KEY, LOCAL_STORAGE_KEYS, MODAL_TYPE } from '@const'
import { loadSeoHead } from '@/utils/init'
import { init, isClose, isConnecting, isOpen } from '@/ws'

const isDev = ref(import.meta.env.DEV)

const route = useRoute()
const appStore = useAppStore()
const { isDesktop, isMobile } = storeToRefs(appStore)
const { initAppConfig, setAppConfig, initCategories, setCategories } = appStore

loadSeoHead()
const { authDialog, fileSelectDialog, subPlanDialog, subscriptionDialog, reportBlockDialog } =
  storeToRefs(useDialogStore())

const accountStore = useAccountStore()
const { resetUserData, logout } = accountStore
const { token, isLogin } = storeToRefs(accountStore)

const guestId = useCookie(COOKIE_KEY.GUEST_ID, { default: uuidv4, readonly: true })

const hydrationStore = useHydrationStore()
const { appConfig, categories, userData } = storeToRefs(hydrationStore)

const execTable = {
  base: [
    { name: 'appConfig', fetcher: initAppConfig, hydrationTarget: appConfig, hydrationAction: setAppConfig },
    { name: 'categories', fetcher: initCategories, hydrationTarget: categories, hydrationAction: setCategories },
  ],
  login: [
    {
      name: 'userData',
      fetcher: async () => {
        const data = await useRequest('User.info', { immediate: true })
        resetUserData(data)
        return data
      },
      hydrationTarget: userData,
      hydrationAction: resetUserData,
    },
  ],
}
onServerClientOnce(async (isSSR) => {
  const executors = token.value ? [...execTable.base, ...execTable.login] : [...execTable.base]
  try {
    const datas = await Promise.allSettled(executors.map((e) => e.fetcher()))
    if (isSSR) {
      executors.forEach(({ hydrationTarget }, i) => {
        hydrationTarget.value = datas[i]
      })
    }
  } catch (e) {
    console.error(e)
  }

  if (!isSSR) {
    // IM 模組初始化
    init({ oauthId: guestId.value })
  }
})
onHydration(() => {
  const executors = token.value ? [...execTable.base, ...execTable.login] : [...execTable.base]
  for (const { name, hydrationAction, hydrationTarget } of executors) {
    const { status, value, reason } = hydrationTarget.value
    if (status === 'fulfilled') {
      hydrationAction(value)
      console.log('[Hydration]', name, 'is reverted', value)
    } else {
      logout()
      console.log('[Hydration]', name, 'is rejected', reason)
      break
    }
  }

  // IM 模組初始化
  init({ oauthId: guestId.value })
})

// 訪客初次進站興趣選擇
const modalStore = useModalStore()
const { open } = modalStore
const interestedList = useLocalStorage(LOCAL_STORAGE_KEYS.INTERESTED_LIST, [])
onMounted(() => {
  if (!isLogin.value && interestedList.value.length === 0) {
    open(MODAL_TYPE.INTERESTED_PICK, {
      size: 'xl',
      confirmAction(data) {
        interestedList.value.push(...data)
      },
    })
  }
})
</script>
