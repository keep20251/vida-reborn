<template>
  <BaseDialog @click:around="reportBlockDialog = false" no-padding>
    <template #default>
      <div class="flex cursor-pointer items-center space-x-10 px-36 pb-20 pt-30" @click="report">
        <Icon name="report" size="20"></Icon>
        <span class="font-bold">Report</span>
      </div>
      <div class="mx-26 h-1 bg-gray-e5"></div>
      <div class="flex cursor-pointer items-center space-x-10 px-36 pb-30 pt-20" @click="block">
        <Icon name="mineSetBlock" size="20"></Icon>
        <span class="font-bold">{{ isBlocked ? $t('content.unblock') : $t('title.blockAcc') }}</span>
        <Loading v-if="isLoading"></Loading>
      </div>
    </template>
  </BaseDialog>
</template>

<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useDialogStore } from '@/store/dialog'
import BaseDialog from '@comp/dialog/BaseDialog.vue'
import useRequest from '@use/request'
import { BLOCK_ACTION } from '@const'

const dialogStore = useDialogStore()
const { reportBlockDialog, reportBlockFeed } = storeToRefs(dialogStore)
const { closeDiss } = dialogStore

const isBlocked = computed(() => reportBlockFeed.value.user.is_block)

const { isLoading, execute } = useRequest('User.block')

function report() {}

function block() {
  if (isLoading.value) return

  const reqData = {
    aff_blocked: reportBlockFeed.value.user.aff,
    action_type: isBlocked.value ? BLOCK_ACTION.UNBLOCK : BLOCK_ACTION.BLOCK,
  }

  execute(reqData)
    .then(() => {
      reportBlockFeed.value.user.is_block = !reportBlockFeed.value.user.is_block
      closeDiss()
    })
    .catch((e) => console.error(e))
}
</script>
