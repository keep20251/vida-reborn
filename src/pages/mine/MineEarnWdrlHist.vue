<template>
  <div class="pt-10">
    <List :items="items" item-key="id">
      <template #default="{ item, last }">
        <div :key="itemKey ? item[itemKey] : index" class="space-y-10 pb-10 pt-10 last:pb-0">
          <div class="flex justify-between items-center">
            <div class="text-base font-bold leading-md">{{ $t('info.time') }}</div>
            <div class="text-gray-57 text-base font-normal leading-lg">{{ item.created_at }}</div>
          </div>
          <div class="flex justify-between items-center">
            <div class="text-base font-bold leading-md">{{ $t('label.wdrlAmount') }}</div>
            <div class="text-base font-normal leading-md">$ {{ item.amount }}</div>
          </div>
          <div class="flex justify-between items-center">
            <div class="text-base font-bold leading-md">{{ $t('label.status') }}</div>
            <div class="text-base font-normal leading-lg">{{ statusShow(item.status) }}</div>
          </div>
        </div>
        <div v-if="!last" class="h-1 bg-black opacity-[0.15]"></div>
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
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import List from '@comp/common/List.vue'
import useRequest from '@use/request/index.js'
import { WITHDRAW_LIST_STATUS } from '@/constant/index.js'

const items = ref(null)

onMounted(() => {
  wdrlHist()
})

let data
const wdrlHist = async () => {
  const { execute } = useRequest('User.listWithdraw')
  try {
    data = await execute({
      page: 1,
      limit: 10,
    })
    console.log('這個是data', data)
    items.value = data.list
    console.log('看一下data有沒有等於items', items.value)
  } catch (e) {
    console.error(e)
  }
}

const { t: $t } = useI18n()
const statusShow = computed(() => {
  return (status) => {
    switch (status) {
      case WITHDRAW_LIST_STATUS.PAID:
        return $t('info.paid')
      case WITHDRAW_LIST_STATUS.NOT_REVIEWED:
        return $t('info.notReviewed')
      case WITHDRAW_LIST_STATUS.UNDER_REVIEW:
        return $t('info.underReview')
      default:
        return $t('info.auditFailure')
    }
  }
})
</script>
