<template>
  <div class="items-center border-t pt-10">
    <List :items="items" item-key="aff_blocked">
      <template #default="{ item, index }">
        <div class="flex items-center justify-between py-10">
          <div class="flex items-center">
            <Avatar class="mr-10" :radius="30" :src="item.thumb || defaultAvatar"></Avatar>
            <div class="text-base font-bold leading-md">{{ item.nickname }}</div>
          </div>
          <div
            @click="unblock(item.aff_blocked, index)"
            class="text-gray-57 cursor-pointer text-base font-bold leading-lg"
          >
            {{ $t('content.unblock') }}
          </div>
        </div>
      </template>
      <template #bottom>
        <div class="text-gray-a3 flex items-center justify-center py-8">
          <Loading></Loading>{{ $t('common.noMore') }}
        </div>
      </template>
    </List>
  </div>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import List from '@comp/common/List.vue'
import Avatar from '@comp/multimedia/Avatar.vue'
import useRequest from '@use/request/index.js'
import defaultAvatar from '@/assets/images/avatar.jpeg'
import { BLOCK_UPDATE } from '@/constant/index.js'

const items = ref(null)

onMounted(() => {
  blockList()
})

let data
const blockList = async () => {
  const { execute } = useRequest('User.listBlock')
  try {
    data = await execute({
      page: 1,
      limit: 10,
    })
    items.value = data.list
    console.log('items.value是多少', items.value)
  } catch (e) {
    console.error(e)
  }
}

const unblock = async (blocked, index) => {
  console.log(`看看blocked和index`, blocked, index)
  try {
    const { execute } = useRequest('User.block')
    await execute({
      aff_blocked: blocked,
      action_type: BLOCK_UPDATE.CANCEL_BLOCK,
    })
    blockList()
    console.log('成功囉')
  } catch (e) {
    console.error(e)
  }
}
</script>
