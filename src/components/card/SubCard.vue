<template>
  <div>
    <List :items="dataList" item-key="id">
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
                <div class="text-sm font-normal leading-3 text-gray-57">134 {{ $t('content.subscribers') }}</div>
                <div class="text-sm font-normal leading-3 text-gray-57">•</div>
                <div class="text-sm font-normal leading-3 text-gray-57">1938 {{ $t('content.view') }}</div>
              </div>
              <div class="text-sm font-normal leading-4 text-gray-a3">
                {{ $t('content.subIn') }}
                {{ item.status === SUB_STATUS.RESTORE_SUB ? $t('content.expiration') : $t('content.renew') }}
              </div>
            </div>
            <Button contrast>{{ $t('common.unsubscribe') }}</Button>
          </div>
        </div>
      </template>
      <template #bottom>
        <div class="flex items-center justify-center py-20 text-gray-a3">
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
import { useInfinite } from '@use/request/infinite'
import { SUB_STATUS } from '@const'

const { dataList, isLoading, noMore, init, next, revert } = useInfinite('User.listSubsByCreator', {
  params: {},
})

const { mineTransactionList } = storeToRefs(useHydrationStore())
onServerClientOnce(async (isSSR) => {
  await init()
  if (isSSR) mineTransactionList.value = dataList.value
  console.log(dataList, '看裡面')
  console.log(dataList.value)
})
onHydration(() => revert(mineTransactionList.value))

const { setNextFn, clearNextFn } = useMineStore()
onMounted(() => setNextFn(next))
onUnmounted(() => clearNextFn(next))
onActivated(() => setNextFn(next))
onDeactivated(() => clearNextFn(next))

const formatDate = (date) => {
  return date.slice(0, 10)
}
const recCreators = ref([
  {
    creator_avatar: null,
    creator_name: 'Cursed_ellie',
    creator_acc: 'cursed_ellie',
    posts: 134,
    sub_member: 1938,
    id: 1,
  },
  {
    creator_avatar: null,
    creator_name: 'Cursed_ellie',
    creator_acc: 'cursed_ellie',
    posts: 134,
    sub_member: 1938,
    id: 2,
  },
  {
    creator_avatar: null,
    creator_name: 'Cursed_ellie',
    creator_acc: 'cursed_ellie',
    posts: 134,
    sub_member: 1938,
    id: 3,
  },
])
</script>
