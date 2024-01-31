<template>
  <Tab v-model="tab" :options="tabOptions" class="!h-35"></Tab>
  <div v-if="tab === 1">
    <TransactionList></TransactionList>
  </div>
  <div v-else-if="tab === 2">
    <RecCard :button-text="$t('common.unsubscribe')"></RecCard>
  </div>
  <div v-else-if="tab === 3">
    <div class="pt-20 text-base font-bold leading-lg">{{ $t('content.allPosts') }} 13</div>
    <div class="overflow-x-hidden">
      <List :items="items" item-key="id">
        <template #default="{ last }">
          <Feed class="py-20"></Feed>
          <div v-if="!last" class="h-1 bg-black opacity-[0.15]"></div>
        </template>
        <template #bottom>
          <div class="flex items-center justify-center py-8 text-gray-a3">
            <Loading></Loading>{{ $t('common.noMore') }}
          </div>
        </template>
      </List>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import RecCard from '@comp/card/RecCard.vue'
import List from '@comp/common/List.vue'
import Feed from '@comp/main/Feed.vue'
import TransactionList from '@comp/mine/TransactionList.vue'
import Tab from '@comp/navigation/Tab.vue'

const tab = ref(1)
const tabOptions = ref([
  { label: 'label.texn', value: 1 },
  { label: 'label.subs', value: 2 },
  { label: 'label.artPur', value: 3 },
])

const items = ref([])
</script>
