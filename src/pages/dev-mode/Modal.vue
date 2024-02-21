<template>
  <Page>
    <div class="mt-16 flex w-1/2 flex-col space-y-10">
      <Button @click="alertModal('xs')">xs</Button>
      <Button @click="confirmModal('sm')">sm</Button>
      <Button @click="confirmModal('md')">md</Button>
      <Button @click="customModal('lg')">lg</Button>
      <Button @click="openMessage('測試')">popupMessage</Button>
    </div>
  </Page>
</template>

<script setup>
import { useModalStore } from '@/store/modal'
import { usePopupMessageStore } from '@/store/popup-message'
import Button from '@comp/common/Button.vue'
import { MODAL_TYPE } from '@const'

const modalStore = useModalStore()
const { alert, confirm, open } = modalStore

const { open: openMessage } = usePopupMessageStore()

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
</script>
