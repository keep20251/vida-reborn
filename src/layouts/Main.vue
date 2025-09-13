<template>
  <div class="flex h-full w-full flex-row justify-center">
    <Navigator v-if="isDesktop"></Navigator>
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component"></component>
      </keep-alive>
    </router-view>
    <ClientOnly>
      <FeedbackDailog></FeedbackDailog>
      <FeedDialog></FeedDialog>
      <AuthDialog></AuthDialog>
      <FileSelectDialog></FileSelectDialog>
      <SubPlanDialog></SubPlanDialog>
      <Subscriptions></Subscriptions>
      <MinePrvwBanner></MinePrvwBanner>
      <PaymentDialog />
      <AlreadySubscribedDialog />
      <PopupMessage></PopupMessage>
      <BottomPromptBar></BottomPromptBar>
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
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/store/app'
import MinePrvwBanner from '@comp/banner/MinePrvwBanner.vue'
import AuthDialog from '@comp/dialog/AuthDialog.vue'
import FileSelectDialog from '@comp/dialog/FileSelectDialog.vue'
import PopupMessage from '@comp/dialog/PopupMessage.vue'
import SubPlanDialog from '@comp/dialog/SubPlanDialog.vue'
import Subscriptions from '@comp/dialog/Subscriptions.vue'
import Navigator from '@comp/layout/Navigator.vue'
import NavigatorMobile from '@comp/layout/NavigatorMobile.vue'
import BottomPromptBar from '@/components/common/BottomPromptBar.vue'
import AlreadySubscribedDialog from '@/components/dialog/AlreadySubscribedDialog.vue'
import FeedDialog from '@/components/dialog/FeedDialog.vue'
import FeedbackDailog from '@/components/dialog/FeedbackDailog.vue'
import PaymentDialog from '@/components/dialog/PaymentDialog.vue'
import { isClose, isConnecting, isOpen } from '@/ws'

const isDev = ref(import.meta.env.DEV)

const appStore = useAppStore()
const { isDesktop, isMobile } = storeToRefs(appStore)

// 訪客初次進站興趣選擇
// const accountStore = useAccountStore()
// const { isLogin } = storeToRefs(accountStore)
// const modalStore = useModalStore()
// const { open } = modalStore
// const interestedList = useLocalStorage(LOCAL_STORAGE_KEYS.INTERESTED_LIST, [])
// onMounted(() => {
//   if (!isLogin.value && interestedList.value.length === 0) {
//     open(MODAL_TYPE.INTERESTED_PICK, {
//       size: 'xl',
//       confirmAction(data) {
//         interestedList.value.push(...data)
//       },
//     })
//   }
// })
</script>
