<template>
  <Tab v-model="tab" :options="tabOptions" class="!h-35"></Tab>
  <div v-if="tab === 1">
    <TransactionList :items="list"></TransactionList>
  </div>
  <div v-else-if="tab === 2">
    <RecCard class="mt-30" :items="recCreators" @click="cancelBlock" :button-text="'取消订阅'"></RecCard>
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
import TransactionList from '@comp/mine/TransactionList.vue'
import RecCard from '@comp/card/RecCard.vue'
import defaultAvatar from '@/assets/images/avatar.jpeg'
import List from '@comp/common/List.vue'
import Feed from '@comp/main/Feed.vue'
import Loading from '@comp/common/Loading.vue'

const tab = ref(1)
const tabOptions = ref([
  { label: 'Transactions', value: 1 },
  { label: 'Subscriptions', value: 2 },
  { label: '已购买帖子', value: 3 },
])

const list = ref([
  {
    title: 'Cursed_ellie',
    order: 'SUB12345',
    price: 1500,
    card: '1234********1234',
    date: '2024-01-01',
  },
  {
    title: 'Cursed_ellie',
    order: 'SUB12345',
    price: 1234,
    card: '1234********1234',
    date: '2024-01-02',
  },
  {
    title: 'Cursed_ellie',
    order: 'SUB12345',
    price: 12353,
    card: '1234********1234',
    date: '2024-01-04',
  },
])

const recCreators = ref([
  {
    creator_avatar: defaultAvatar,
    creator_name: 'Cursed_ellie',
    creator_acc: 'cursed_ellie',
    posts: 134,
    sub_member: 1938,
    id: 1,
  },
  {
    creator_avatar: defaultAvatar,
    creator_name: 'Cursed_ellie',
    creator_acc: 'cursed_ellie',
    posts: 134,
    sub_member: 1938,
    id: 2,
  },
  {
    creator_avatar: defaultAvatar,
    creator_name: 'Cursed_ellie',
    creator_acc: 'cursed_ellie',
    posts: 134,
    sub_member: 1938,
    id: 3,
  },
])

const cancelBlock = (e) => {
  console.log(e)
}

const items = ref([{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }])
</script>
