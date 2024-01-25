<template>
  <div class="flex w-full flex-col space-y-30">
    <CameraCapture
      title="1. 证件资讯正面照片"
      picture-info="My Picture"
      button-text="開始拍攝【證件資訊正面照片】"
    ></CameraCapture>
    <CameraCapture
      title="2. 用户脸部与证件资讯正面照片"
      picture-info="My Picture"
      button-text="开始拍摄【用户脸部与证件资讯正面照片】"
    ></CameraCapture>
    <div>
      <div class="mb-10 text-center text-base font-normal leading-md">确认照片后送出资料</div>
      <Button @click="send">送出申請資料</Button>
    </div>
  </div>
</template>
<script setup>
import { useI18n } from 'vue-i18n'
import { useModalStore } from '@/store/modal'
import Button from '@comp/common/Button.vue'
import CameraCapture from '@comp/mine/CameraCapture.vue'
import { MODAL_TYPE } from '@const'

const { t: $t } = useI18n()
const { open } = useModalStore()

function send() {
  open(MODAL_TYPE.CONFIRM, {
    title: '再次確認',
    size: 'sm',
    content: '请问您是否确认要送出资料？',
    confirmText: $t('common.confirm'),
    confirmAction: () => {},
    cancelText: $t('common.cancel'),
    cancelAction: () => {},
  })
}
</script>
