<template>
  <div>
    <List :items="dataList" item-key="id" divider>
      <template #default="{ item }">
        <div class="pb-20 pt-20">
          <div class="flex grow items-center justify-between space-x-10">
            <Avatar :radius="15" :src="item.thumb"></Avatar>
            <div class="flex grow flex-col space-y-5">
              <div class="flex space-x-5">
                <div class="text-base font-bold leading-md">{{ item.nickname }}</div>
                <div class="text-sm font-normal leading-3">@{{ item.username }}</div>
              </div>
              <div class="flex items-center space-x-5">
                <div class="text-sm font-normal leading-3 text-gray-57">
                  {{ item.subscriber_count }} {{ $t('content.subscribers') }}
                </div>
                <div class="text-sm font-normal leading-3 text-gray-57">•</div>
                <div class="text-sm font-normal leading-3 text-gray-57">
                  {{ item.videos_count }} {{ $t('content.view') }}
                </div>
              </div>
              <div class="text-sm font-normal leading-4 text-gray-a3">
                {{ $t('content.subIn') }} {{ formatDate(item.expire_time) }}
                {{
                  item.status === SUB_STATUS.CANCEL_SUB
                    ? $t('content.renew')
                    : item.status === SUB_STATUS.RESTORE_SUB
                      ? $t('content.expiration')
                      : $t('content.beExpired')
                }}
              </div>
              <div class="text-sm font-semibold leading-normal text-primary">{{ item.subscription_title }}</div>
            </div>
            <div>
              <Button
                @click="onSubStatus(item)"
                :class="{
                  'bg-gray-a3': item.status === SUB_STATUS.CANCEL_SUB,
                  'bg-contrast': item.status === SUB_STATUS.RESTORE_SUB,
                  'bg-primary': item.status === SUB_STATUS.RE_SUB,
                  'bg-subscribe-light-pink': item.status === SUB_STATUS.SUB_IN_ADVANCE,
                }"
                contrast
                size="sm"
                class="whitespace-nowrap"
                >{{
                  item.status === SUB_STATUS.CANCEL_SUB
                    ? $t('common.cancelSubscribe')
                    : item.status === SUB_STATUS.RESTORE_SUB
                      ? $t('common.restoreSubscribe')
                      : item.status === SUB_STATUS.RE_SUB
                        ? $t('common.reSubscribe')
                        : '提前續訂'
                }}</Button
              >
            </div>
          </div>
        </div>
      </template>
      <template #bottom>
        <div class="flex flex-col items-center justify-center py-8 text-gray-a3">
          <div v-if="!!serverError" class="text-sm font-normal leading-md text-warning">{{ serverError }}</div>
          <Loading v-if="isLoading">{{ $t('common.loading') }}</Loading>
          <span v-if="noMore">{{ $t('common.noMore') }}</span>
        </div>
      </template>
    </List>
  </div>
</template>
<script setup>
import { onActivated, onDeactivated, onMounted, onUnmounted, ref } from 'vue'
import { useMineStore } from '@/store/mine'
import { useModalStore } from '@/store/modal'
import { usePopupMessageStore } from '@/store/popup-message'
import Button from '@comp/common/Button.vue'
import Avatar from '@comp/multimedia/Avatar.vue'
import { useDialog } from '@use/modal'
import useRequest from '@use/request/index.js'
import { useInfinite } from '@use/request/infinite'
import { CANCEL_SUB_TYPE, SUB_STATUS } from '@const'

const { open, confirm } = useModalStore()
const { open: openMessage } = usePopupMessageStore()
const { subscribe } = useDialog()
const { dataList, isLoading, noMore, init, next, reload } = useInfinite('User.listSubs', {
  params: {},
})

const { setNextFn, clearNextFn } = useMineStore()
onMounted(() => reload())
onUnmounted(() => clearNextFn(next))
onActivated(() => {
  setNextFn(next)
  reload()
})
onDeactivated(() => clearNextFn(next))

const onSubStatus = (item) => {
  const i = ref({
    ...item,
    picture: item.background,
    id: item.subscription_id,
  })
  const creator = ref({
    aff: item.aff,
    username: item.username,
  })
  if (item.status === SUB_STATUS.CANCEL_SUB) {
    confirm({
      size: 'sm',
      title: '再次確認',
      content: '你確定要取消訂閱嗎？',
      confirmAction: () => {
        handleSubscription(CANCEL_SUB_TYPE.CANCEL_SUB, item.subscription_id)
      },
    })
  } else if (item.status === SUB_STATUS.RESTORE_SUB) {
    confirm({
      size: 'sm',
      title: '再次確認',
      content: '你確定要取消訂閱嗎？',
      confirmAction: () => {
        handleSubscription(CANCEL_SUB_TYPE.RESTORE_SUB, item.subscription_id)
      },
    })
  } else if (item.status === SUB_STATUS.RE_SUB) {
    try {
      subscribe({ item: i.value, creator: creator.value })
      handleSubscription(CANCEL_SUB_TYPE.RESTORE_SUB, item.subscription_id)
    } catch (e) {
      openMessage('重新訂閱失敗', e)
    }
  } else {
    try {
      subscribe({ item: i.value, creator: creator.value })
      handleSubscription(CANCEL_SUB_TYPE.SUB_IN_ADVANCE, item.subscription_id)
    } catch (e) {
      openMessage('提前續訂失敗', e)
    }
  }
}

const serverError = ref('')
async function handleSubscription(type, userSubscriptionId) {
  const { execute } = useRequest('Payment.cancelSub')
  try {
    await execute({
      type: type,
      userSubscriptionId: userSubscriptionId,
    })
    reload()
    serverError.value = ''
  } catch (e) {
    serverError.value = e.message
    console.error(e)
  }
}

const formatDate = (date) => {
  return date.slice(0, 16)
}
</script>
