<template>
  <Page>
    <div class="mt-16 flex w-1/2 flex-col space-y-10">
      <Button @click="alertModal('xs')">xs</Button>
      <Button @click="confirmModal('sm')">sm</Button>
      <Button @click="confirmModal('md')">md</Button>
      <Button @click="customModal('lg')">lg</Button>
      <Button @click="openMessage('common.confirm')">popupMessage</Button>
      <Button @click="testBottomPrompt" class="bg-purple-600">测试底部提示栏</Button>
      <Button @click="simulatePaymentSuccess" class="bg-green-600">模拟支付成功（未登录）</Button>
      <Button @click="toggleLoginStatus" class="bg-blue-600">切换登录状态测试</Button>
    </div>
  </Page>
</template>

<script setup>
import { useModalStore } from '@/store/modal'
import { usePopupMessageStore } from '@/store/popup-message'
import { useDialog } from '@/compositions/modal'
import { useAccountStore } from '@/store/account'
import Button from '@comp/common/Button.vue'
import { MODAL_TYPE } from '@const'

const modalStore = useModalStore()
const { alert, confirm, open } = modalStore

const { open: openMessage } = usePopupMessageStore()
const { testBottomPrompt, subscribeSuccess, shopBuySuccess } = useDialog()
const accountStore = useAccountStore()

function alertModal(size) {
  alert({
    size,
    title: '這是一個 Alert',
    content: '哈哈哈哈',
    confirmAction: () => {
      return new Promise((resolve) => {
        setTimeout(() => resolve(), 2500)
      })
    },
  })
}

function confirmModal(size) {
  confirm({
    size,
    title: '嘻嘻哈哈',
    content: '1234567654132743543641352',
    confirmAction: () => {
      return new Promise((resolve) => {
        // 處理過程發生錯誤就回傳一段「字串」讓 Modal 顯示出來且不關閉彈窗
        setTimeout(() => resolve('請求發生錯誤'), 2500)
      })
    },
    cancelAction: () => {},
  })
}

function customModal(size) {
  open(MODAL_TYPE.TEST, {
    size,
    title: '測試彈窗',
    confirmAction: (data) => {
      console.log('我還可以在這邊繼續非同步')
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log(data)
          resolve()
        }, 2000)
      })
    },
    cancelAction: () => {},
  })
}

// 模拟支付成功场景
function simulatePaymentSuccess() {
  // 模拟订阅成功的场景
  const mockCreator = {
    username: 'test_creator',
    nickname: '测试创作者',
    aff: 'test_aff_123'
  }
  
  const mockFeed = {
    id: 'test_feed_123',
    user: {
      username: 'test_user',
      aff: 'test_user_aff_123'
    }
  }
  
  console.log('模拟支付成功场景...')
  
  // 测试订阅成功
  subscribeSuccess(mockCreator)
  
  // 延迟2秒后测试购买成功
  setTimeout(() => {
    shopBuySuccess(mockFeed)
  }, 2000)
}

// 切换登录状态进行测试
function toggleLoginStatus() {
  const currentStatus = accountStore.isLogin
  console.log('当前登录状态:', currentStatus)
  
  if (currentStatus) {
    // 如果已登录，模拟登出
    accountStore.logout()
    console.log('已模拟登出，现在可以测试未登录场景')
  } else {
    // 如果未登录，模拟登录
    console.log('当前未登录，可以测试底部提示栏功能')
  }
}
</script>
