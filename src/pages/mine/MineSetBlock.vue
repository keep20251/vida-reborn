<template>
  <div class="items-center border-t pt-10">
    <List :items="dataList" item-key="aff_blocked">
      <template #default="{ item }">
        <div class="flex items-center justify-between py-10">
          <div class="flex items-center">
            <Avatar class="mr-10" :radius="15" :src="item.thumb"></Avatar>
            <div class="text-base font-bold leading-md">{{ item.nickname }}</div>
          </div>
          <div @click="unblock(item.aff_blocked)" class="cursor-pointer text-base font-bold leading-lg text-gray-57">
            {{ $t('content.unblock') }}
          </div>
        </div>
      </template>
      <template #bottom>
        <div v-if="!isLoading && dataList.length === 0">
          <NoData v-if="dataList.length === 0">{{ $t('common.noMore') }}</NoData>
        </div>
        <div v-else class="flex items-center justify-center py-8 text-gray-a3">
          <Loading v-if="isLoading">{{ $t('common.loading') }}</Loading>
          <span v-if="noMore">{{ $t('common.noMore') }}</span>
        </div>
      </template>
    </List>
  </div>
</template>
<script setup>
import { onActivated, onDeactivated, onMounted, onUnmounted } from 'vue'
import { useFeedStore } from '@/store/feed'
import { useMineStore } from '@/store/mine'
import { useModalStore } from '@/store/modal'
import { usePopupMessageStore } from '@/store/popup-message'
import NoData from '@comp/info/NoData.vue'
import Avatar from '@comp/multimedia/Avatar.vue'
import useRequest from '@use/request/index.js'
import { useInfinite } from '@use/request/infinite'
import { BLOCK_ACTION } from '@const'

const { open: openMessage } = usePopupMessageStore()
const { open } = useModalStore() // 解構出 open 方法

const feedStore = useFeedStore()
const { toggleBlock } = feedStore

const { dataList, isLoading, noMore, init, next, reload } = useInfinite('User.listBlock', {
  params: {},
})

const { setNextFn, clearNextFn } = useMineStore()
onMounted(() => init())
onUnmounted(() => clearNextFn(next))
onActivated(() => {
  setNextFn(next)
  reload()
})
onDeactivated(() => clearNextFn(next))

async function unblock(aff_blocked) {
  try {
    const { execute } = useRequest('User.block')
    await execute({
      aff_blocked,
      action_type: BLOCK_ACTION.UNBLOCK,
    })
    openMessage('content.unblock')
    toggleBlock(aff_blocked, false)
    reload()
  } catch (e) {
    console.error(e)
    openMessage('title.updateFail')
  }
}
</script>
