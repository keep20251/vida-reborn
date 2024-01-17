<template>
  <Page>
    <div @click="alertModal('xs')">xs</div>
    <div @click="confirmModal('sm')">sm</div>
    <div @click="confirmModal('md')">md</div>
    <div @click="customModal('lg')">lg</div>
  </Page>
</template>

<script setup>
import { useModalStore } from '@/store/modal'
import { MODAL_TYPE } from '@const'

const modalStore = useModalStore()
const { alert, confirm, open } = modalStore

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
