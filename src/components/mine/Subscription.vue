<template>
  <div class="pb-20 pt-20 last:border-b">
    <div class="flex grow justify-between space-x-10">
      <div class="flex items-center justify-center">
        <Avatar @click="toCreator(item?.username)" :radius="15" :src="item.thumb" class="cursor-pointer"></Avatar>
      </div>
      <div class="flex grow flex-col space-y-5">
        <div class="flex space-x-5">
          <div class="cursor-pointer text-base font-bold leading-md" @click="toCreator(item?.username)">
            {{ item.nickname }}
          </div>
          <div class="text-sm font-normal leading-3">@{{ item.username }}</div>
        </div>
        <div class="flex items-center space-x-5">
          <div v-if="false" class="text-sm font-normal leading-3 text-gray-57">
            {{ item.subscriber_count }} {{ $t('content.subscribers') }}
          </div>
          <div class="text-sm font-normal leading-3 text-gray-57">{{ item.post_num }} {{ $t('info.perPost') }}</div>
          <div class="text-sm font-normal leading-3 text-gray-57">•</div>
          <div class="text-sm font-normal leading-3 text-gray-57">
            {{ toKMBTString(item.view_count) }} {{ $t('content.view') }}
          </div>
        </div>
        <div class="text-sm font-normal leading-4 text-gray-a3">
          {{ $t('content.subIn') }} {{ formatDate(item.expire_time) }}
          {{
            item.status === SUB_STATUS.CANCEL_SUB
              ? $t('content.renew')
              : item.status === SUB_STATUS.RE_SUB
                ? $t('content.beExpired')
                : $t('content.expiration')
          }}
        </div>
        <div class="text-sm font-semibold leading-normal text-primary">{{ item.subscription_name }}</div>
      </div>
      <div
        class="flex items-center justify-center"
        v-if="item.status === SUB_STATUS.CANCEL_SUB || item.status === SUB_STATUS.RE_SUB"
      >
        <Button
          @click="onSubStatus(item)"
          :class="{
            'bg-gray-a3': item.status === SUB_STATUS.CANCEL_SUB,
            'bg-primary': item.status === SUB_STATUS.RE_SUB,
          }"
          contrast
          size="sm"
          class="whitespace-nowrap"
          >{{ item.status === SUB_STATUS.CANCEL_SUB ? $t('common.cancelSubscribe') : $t('common.reSubscribe') }}</Button
        >
      </div>
      <div
        v-if="item.status === SUB_STATUS.RESTORE_SUB || item.status === SUB_STATUS.SUB_IN_ADVANCE"
        class="flex items-end text-sm underline"
        @click="onSubStatus(item)"
        :class="{
          'text-contrast': item.status === SUB_STATUS.RESTORE_SUB,
          'text-subscribe-light-pink': item.status === SUB_STATUS.SUB_IN_ADVANCE,
        }"
      >
        {{ item.status === SUB_STATUS.RESTORE_SUB ? $t('common.restoreSubscribe') : $t('common.beforehandSubscribe') }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { useModalStore } from '@/store/modal'
import { usePopupMessageStore } from '@/store/popup-message'
import Button from '@comp/common/Button.vue'
import Avatar from '@comp/multimedia/Avatar.vue'
import { useDialog } from '@use/modal'
import useRequest from '@use/request/index.js'
import { useRouters } from '@use/routers'
import { CANCEL_SUB_TYPE, SUB_STATUS } from '@const'
import { toKMBTString } from '@/utils/string-helper'

const { t: $t } = useI18n()
const { confirm } = useModalStore()
const { open: openMessage } = usePopupMessageStore()
const { subscribe } = useDialog()
const { toCreator } = useRouters()

defineProps({
  item: { type: Object, required: true },
})

const emits = defineEmits(['reload', 'toCreator'])

const onSubStatus = (item) => {
  const _item = {
    ...item,
    picture: item.background,
    id: item.subscription_id,
  }
  const creator = {
    aff: item.aff,
    username: item.username,
  }
  if (item.status === SUB_STATUS.CANCEL_SUB) {
    confirm({
      size: 'sm',
      title: 'beCreator.title.reConfirm',
      content: $t('common.whetherCancelSub'),
      confirmAction: () => {
        handleSubscription(CANCEL_SUB_TYPE.CANCEL_SUB, item.subscription_id)
      },
    })
  } else if (item.status === SUB_STATUS.RESTORE_SUB) {
    confirm({
      size: 'sm',
      title: 'beCreator.title.reConfirm',
      content: $t('common.whetherCrestoreSub'),
      confirmAction: () => {
        handleSubscription(CANCEL_SUB_TYPE.RESTORE_SUB, item.subscription_id)
      },
    })
  } else if (item.status === SUB_STATUS.RE_SUB) {
    try {
      subscribe({ item: _item, creator })
    } catch (e) {
      openMessage('common.reSubErr', e)
    }
  } else {
    try {
      subscribe({ item: _item, creator })
    } catch (e) {
      openMessage('common.subInAdvanceErr', e)
    }
  }
}

async function handleSubscription(type, userSubscriptionId) {
  const { execute } = useRequest('Payment.cancelSub')
  try {
    await execute({ type, userSubscriptionId })
    emits('reload')
  } catch (e) {
    openMessage(e.message, true)
    console.error(e)
  }
}

const formatDate = (date) => {
  return date.slice(0, 16)
}
</script>
