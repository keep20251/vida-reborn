<template>
  <BaseDialog @click:around="reportBlockDialog = false" no-padding>
    <template #default>
      <div class="flex cursor-pointer items-center space-x-10 px-36 pb-20 pt-30" @click="report">
        <Icon name="report" size="20"></Icon>
        <span class="font-bold">{{ $t('label.report') }}</span>
      </div>
      <div class="mx-26 h-1 bg-gray-e5"></div>
      <div class="flex cursor-pointer items-center space-x-10 px-36 pb-30 pt-20" @click="block">
        <Icon name="mineSetBlock" size="20"></Icon>
        <span class="font-bold">{{ isBlocked ? $t('content.unblock') : $t('label.block') }}</span>
        <Loading v-if="isLoadingBlock"></Loading>
      </div>
    </template>
  </BaseDialog>
</template>

<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useCreatorStore } from '@/store/creator'
import { useDialogStore } from '@/store/dialog'
import { useFeedStore } from '@/store/feed'
import { useModalStore } from '@/store/modal'
import BaseDialog from '@comp/dialog/BaseDialog.vue'
import useRequest from '@use/request'
import { BLOCK_ACTION, MODAL_TYPE } from '@const'

const dialogStore = useDialogStore()
const { reportBlockDialog, reportBlockUser } = storeToRefs(dialogStore)
const { closeDiss } = dialogStore

const modalStore = useModalStore()
const { open } = modalStore

const creatorStore = useCreatorStore()
const { toggleBlock: toggleBlockInCreator } = creatorStore

const feedStore = useFeedStore()
const { toggleBlock: toggleBlockInFeed } = feedStore

const isBlocked = computed(() => reportBlockUser.value.is_block)

const { isLoading: isReportLoading, execute: execReport } = useRequest('User.report')
function report() {
  if (isReportLoading.value) return

  const uuid = reportBlockUser.value.uuid
  closeDiss()
  open(MODAL_TYPE.REPORT, {
    title: 'label.report',
    size: 'lg',
    confirmAction: async (data) => {
      try {
        await execReport({ ...data, uuid })
      } catch (e) {
        return e.message
      }
    },
    cancelAction: closeDiss,
  })
}

const { isLoading: isLoadingBlock, execute: execBlock } = useRequest('User.block')
function block() {
  if (isLoadingBlock.value) return

  const isBlock = isBlocked.value

  const reqData = {
    aff_blocked: reportBlockUser.value.aff,
    action_type: isBlock ? BLOCK_ACTION.UNBLOCK : BLOCK_ACTION.BLOCK,
  }

  execBlock(reqData)
    .then(() => {
      toggleBlockInCreator(reportBlockUser.value.username, !isBlock)
      toggleBlockInFeed(reportBlockUser.value.aff, !isBlock)
      closeDiss()
    })
    .catch((e) => console.error(e))
}
</script>
