<template>
  <div>
    <List :items="items" item-key="id">
      <template #default="{ item, last }">
        <div class="border-gray-e5 pb-20 pt-20" :class="{ 'border-b': !last }">
          <div class="flex grow items-center justify-between space-x-10">
            <Avatar :radius="15" :src="item.thumb"></Avatar>
            <div class="flex grow flex-col space-y-5">
              <div class="flex space-x-5">
                <div class="text-base font-bold leading-md">{{ item.nickname }}</div>
                <div class="text-sm font-normal leading-3">@{{ item.username }}</div>
              </div>
              <div class="flex items-end space-x-5">
                <div class="text-sm font-normal leading-3 text-gray-57">
                  {{ item.subscriber_count }} {{ $t('content.subscribers') }}
                </div>
                <div class="text-sm font-normal leading-3 text-gray-57">•</div>
                <div class="text-sm font-normal leading-3 text-gray-57">{{ item.posts }} {{ $t('content.view') }}</div>
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
                    subscriber_id,
                    subscriber_title,
                    item.background,
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
        <div class="flex items-center justify-center py-8 text-gray-a3">
          <Loading v-if="isLoading">{{ $t('common.loading') }}</Loading>
          <span v-if="noMore">{{ $t('common.noMore') }}</span>
        </div>
      </template>
    </List>
  </div>
</template>
<script setup>
import { onActivated, onDeactivated, onMounted, onUnmounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useHydrationStore } from '@/store/hydration'
import { useMineStore } from '@/store/mine'
import Button from '@comp/common/Button.vue'
import List from '@comp/common/List.vue'
import Avatar from '@comp/multimedia/Avatar.vue'
import { onHydration, onServerClientOnce } from '@use/lifecycle'
import useRequest from '@use/request/index.js'
import { useInfinite } from '@use/request/infinite'
import { SUB_STATUS } from '@const'

const items = ref(null)
onMounted(() => {
  blockList()
})
let data
const blockList = async () => {
  const { execute } = useRequest('User.listSubs')
  try {
    data = await execute({
      page: 1,
      limit: 10,
    })
    items.value = data
    console.log('items.value是多少', items)
  } catch (e) {
    console.error(e)
  }
}

// 等待後端將 list 補上
// const { dataList, isLoading, noMore, init, next, revert } = useInfinite('User.listSubs', {
//   params: {},
// })
// const { mineSubList } = storeToRefs(useHydrationStore())
// onServerClientOnce(async (isSSR) => {
//   await init()
//   if (isSSR) mineSubList.value = dataList.value
// })
// onHydration(() => revert(mineSubList.value))
// const { setNextFn, clearNextFn } = useMineStore()
// onMounted(() => setNextFn(next))
// onUnmounted(() => clearNextFn(next))
// onActivated(() => setNextFn(next))
// onDeactivated(() => clearNextFn(next))

const formatDate = (date) => {
  return date.slice(0, 10)
}

const onSubStatus = (
  uuid,
  status,
  thumb,
  nickname,
  subscriber_price,
  username,
  subscriber_id,
  subscriber_title,
  background,
) => {
  if (status === SUB_STATUS.CANCEL_SUB) {
    console.log('你要取消訂閱齁！')
  } else if (status === SUB_STATUS.RESTORE_SUB) {
    console.log('你要恢復訂閱齁！')
  } else {
    console.log('你要重新訂閱齁！')
  }
}
</script>
