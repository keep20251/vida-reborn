<template>
  <Tab v-model="tab" :options="tabOptions" class="mt-10 !h-35"></Tab>
  <div v-if="tab === 1">
    <div class="leading-lg pt-20 text-base font-bold">全部贴文 13</div>
    <div class="overflow-x-hidden">
      <List :items="items" item-key="id">
        <template #default="{ last }">
          <Feed class="py-20"></Feed>
          <div v-if="!last" class="h-1 bg-black opacity-[0.15]"></div>
        </template>
        <template #bottom>
          <div class="flex items-center justify-center py-8 text-gray36">
            <Loading></Loading>{{ $t('common.noMore') }}
          </div>
        </template>
      </List>
    </div>
  </div>
  <div v-else-if="tab === 2">
    <div class="leading-lg pt-20 text-base font-bold">全部贴文 13</div>
    <div class="overflow-x-hidden">
      <List :items="items" item-key="id">
        <template #default="{ last }">
          <Feed class="py-20"></Feed>
          <div v-if="!last" class="h-1 bg-black opacity-[0.15]"></div>
        </template>
        <template #bottom>
          <div class="flex items-center justify-center py-8 text-gray36">
            <Loading></Loading>{{ $t('common.noMore') }}
          </div>
        </template>
      </List>
    </div>
  </div>
  <div v-else-if="tab === 3">
    <div class="leading-lg pt-20 text-base font-bold">全部贴文 13</div>
    <div class="overflow-x-hidden">
      <List :items="items" item-key="id">
        <template #default="{ last }">
          <Feed class="py-20"></Feed>
          <div v-if="!last" class="h-1 bg-black opacity-[0.15]"></div>
        </template>
        <template #bottom>
          <div class="flex items-center justify-center py-8 text-gray36">
            <Loading></Loading>{{ $t('common.noMore') }}
          </div>
        </template>
      </List>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import Tab from '@comp/navigation/Tab.vue'
import List from '@comp/common/List.vue'
import Feed from '@comp/main/Feed.vue'
import Loading from '@comp/common/Loading.vue'

const tab = ref(1)
const tabOptions = ref([
  { label: '全部', value: 1 },
  { label: '已解锁', value: 2 },
  { label: '未解锁', value: 3 },
])

const items = ref([{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }])
</script>
