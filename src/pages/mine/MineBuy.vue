<template>
  <Tab v-model="tab" :options="tabOptions" class="!h-35"></Tab>
  <div v-show="tab === MINE_BUY_TAB.TRANSACTION">
    <TransactionList></TransactionList>
  </div>
  <div v-show="tab === MINE_BUY_TAB.SUBSCRIPTION">
    <SubCard></SubCard>
  </div>
  <div v-show="tab === MINE_BUY_TAB.PURCHASED_ARTICLE">
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
import SubCard from '@comp/card/SubCard.vue'
import List from '@comp/common/List.vue'
import Feed from '@comp/main/Feed.vue'
import TransactionList from '@comp/mine/TransactionList.vue'
import Tab from '@comp/navigation/Tab.vue'
import { MINE_BUY_TAB } from '@const'

const tab = ref(1)
const tabOptions = ref([
  { label: 'label.texn', value: MINE_BUY_TAB.TRANSACTION },
  { label: 'label.subs', value: MINE_BUY_TAB.SUBSCRIPTION },
  { label: 'label.artPur', value: MINE_BUY_TAB.PURCHASED_ARTICLE },
])

const items = ref([])
</script>
