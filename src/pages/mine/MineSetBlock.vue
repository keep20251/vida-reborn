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
        <div class="flex items-center justify-center py-20 text-gray-a3">
          <Loading v-if="isLoading">{{ $t('common.loading') }}</Loading>
          <span v-if="noMore">{{ $t('common.noMore') }}</span>
        </div>
      </template>
    </List>
  </div>
</template>
<script setup>
import { onActivated, onDeactivated, onMounted } from 'vue'
import { useFeedStore } from '@/store/feed'
import { useMineStore } from '@/store/mine'
import Avatar from '@comp/multimedia/Avatar.vue'
import useRequest from '@use/request/index.js'
import { useInfinite } from '@use/request/infinite'
import { BLOCK_ACTION } from '@const'

const feedStore = useFeedStore()
const { toggleBlock } = feedStore

const { dataList, isLoading, noMore, init, next, reload } = useInfinite('User.listBlock', {
  params: {},
})

const { setNextFn, clearNextFn } = useMineStore()
onMounted(init)
onActivated(() => setNextFn(next))
onDeactivated(() => clearNextFn(next))

async function unblock(aff_blocked) {
  try {
    const { execute } = useRequest('User.block')
    await execute({
      aff_blocked,
      action_type: BLOCK_ACTION.UNBLOCK,
    })
    toggleBlock(aff_blocked, false)
    reload()
  } catch (e) {
    console.error(e)
  }
}
</script>
