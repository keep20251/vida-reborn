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
            </div>
            <div>
              <Button
                @click="
                  onSubStatus(
                    item.uuid,
                    item.status,
                    item.thumb,
                    item.nickname,
                    item.subscriber_price,
                    item.username,
                    item.subscription_id,
                    item.subscriber_title,
                    item.background,
                    item.price,
                  )
                "
                :class="{
                  'bg-gray-a3': item.status === SUB_STATUS.CANCEL_SUB,
                  'bg-contrast': item.status === SUB_STATUS.RESTORE_SUB,
                  'bg-primary': item.status === SUB_STATUS.RE_SUB,
                }"
                contrast
                size="sm"
                >{{
                  item.status === SUB_STATUS.CANCEL_SUB
                    ? $t('common.cancelSubscribe')
                    : item.status === SUB_STATUS.RESTORE_SUB
                      ? $t('common.restoreSubscribe')
                      : $t('common.reSubscribe')
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
import Button from '@comp/common/Button.vue'
import Avatar from '@comp/multimedia/Avatar.vue'
import useRequest from '@use/request/index.js'
import { useInfinite } from '@use/request/infinite'
import { CANCEL_SUB_TYPE, SUB_STATUS } from '@const'

const { dataList, isLoading, noMore, init, next, reload } = useInfinite('User.listSubs', {
  params: {},
})

const { setNextFn, clearNextFn } = useMineStore()
onMounted(() => {
  init()
  setNextFn(next)
})
onUnmounted(() => clearNextFn(next))
onActivated(() => {
  init()
  setNextFn(next)
})
onDeactivated(() => clearNextFn(next))

const formatDate = (date) => {
  return date.slice(0, 16)
}

const onSubStatus = (
  uuid,
  status,
  thumb,
  nickname,
  subscriber_price,
  username,
  subscription_id,
  subscriber_title,
  background,
) => {
  if (status === SUB_STATUS.CANCEL_SUB) {
    console.log(subscription_id)
    console.log('你要取消訂閱齁！')
    cancelSub(subscription_id)
  } else if (status === SUB_STATUS.RESTORE_SUB) {
    console.log('你要恢復訂閱齁！')
    restoreSub(subscription_id)
  } else {
    console.log('你要重新訂閱齁！')
    reSubscribe(subscription_id)
  }
}

const serverError = ref('')
async function cancelSub(subscription_id) {
  const { execute } = useRequest('Payment.cancelSub')
  try {
    await execute({
      type: CANCEL_SUB_TYPE.CANCEL_SUB,
      userSubscriptionId: subscription_id,
    })
    console.log('成功取消訂閱囉')
    reload()
    serverError.value = ''
  } catch (e) {
    serverError.value = e.message
    console.error(e)
  }
}

async function restoreSub(subscription_id) {
  const { execute } = useRequest('Payment.cancelSub')
  try {
    await execute({
      type: CANCEL_SUB_TYPE.RESTORE_SUB,
      userSubscriptionId: subscription_id,
    })
    console.log('成功恢復訂閱囉')
    reload()
    serverError.value = ''
  } catch (e) {
    serverError.value = e.message
    console.error(e)
  }
}

async function reSubscribe(subscription_id) {
  const { execute } = useRequest('Payment.cancelSub')
  try {
    await execute({
      type: CANCEL_SUB_TYPE.RESUBSCRIBE,
      userSubscriptionId: subscription_id,
    })
    console.log('成功重新訂閱囉')
    reload()
    serverError.value = ''
  } catch (e) {
    serverError.value = e.message
    console.error(e)
  }
}
</script>
