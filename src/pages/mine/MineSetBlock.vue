<template>
  <div class="items-center border-t pt-10">
    <List :items="dataList" item-key="aff_blocked">
      <template #default="{ item, index }">
        <div class="flex items-center justify-between py-10">
          <div class="flex items-center">
            <Avatar class="mr-10" :radius="15" :src="item.thumb || defaultAvatar"></Avatar>
            <div class="text-base font-bold leading-md">{{ item.nickname }}</div>
          </div>
          <div
            @click="unblock(item.aff_blocked, index)"
            class="cursor-pointer text-base font-bold leading-lg text-gray-57"
          >
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
import { onActivated, onDeactivated, onMounted, onUnmounted } from 'vue'
import { useMineStore } from '@/store/mine'
import List from '@comp/common/List.vue'
import Avatar from '@comp/multimedia/Avatar.vue'
import useRequest from '@use/request/index.js'
import { useInfinite } from '@use/request/infinite'
import defaultAvatar from '@/assets/images/avatar.jpeg'
import { BLOCK_UPDATE } from '@/constant/index.js'

const { dataList, isLoading, noMore, init, next, revert } = useInfinite('User.listBlock', {
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

const unblock = async (blocked, index) => {
  console.log(`看看blocked和index`, blocked, index)
  try {
    const { execute } = useRequest('User.block')
    await execute({
      aff_blocked: blocked,
      action_type: BLOCK_UPDATE.CANCEL_BLOCK,
    })
    console.log('成功囉')
    await init()
  } catch (e) {
    console.error(e)
  }
}
</script>
