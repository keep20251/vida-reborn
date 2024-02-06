<template>
  <Tab v-model="tab" :options="tabOptions" class="!h-35"></Tab>
  <div v-show="tab === MINE_BUY_TAB.TRANSACTION">
    <TransactionList></TransactionList>
  </div>
  <div v-show="tab === MINE_BUY_TAB.SUBSCRIPTION">
    <SubCard></SubCard>
  </div>
  <div v-show="tab === MINE_BUY_TAB.PURCHASED_ARTICLE">
    <div class="pt-20 text-base font-bold leading-lg">{{ $t('content.allPosts') }} {{ dataList.length }}</div>
    <div class="overflow-x-hidden">
      <List :items="dataList" item-key="id" divider>
        <template #default="{ item }">
          <Feed class="py-20" :item="item"></Feed>
        </template>
        <template #bottom>
          <div class="flex items-center justify-center py-8 text-gray-a3">
            <Loading v-if="isLoading">{{ $t('common.loading') }}</Loading>
            <span v-if="noMore">{{ $t('common.noMore') }}</span>
          </div>
        </template>
      </List>
    </div>
  </div>
</template>
<script setup>
import { onActivated, onDeactivated, onMounted, onUnmounted, ref } from 'vue'
import { useMineStore } from '@/store/mine'
import SubCard from '@comp/card/SubCard.vue'
import Feed from '@comp/main/Feed.vue'
import TransactionList from '@comp/mine/TransactionList.vue'
import Tab from '@comp/navigation/Tab.vue'
import { useInfinite } from '@use/request/infinite'
import { GET_ARTICLE_LIST, MINE_BUY_TAB } from '@const'

const tab = ref(MINE_BUY_TAB.TRANSACTION)
const tabOptions = ref([
  { label: 'label.texn', value: MINE_BUY_TAB.TRANSACTION },
  { label: 'label.subs', value: MINE_BUY_TAB.SUBSCRIPTION },
  { label: 'label.artPur', value: MINE_BUY_TAB.PURCHASED_ARTICLE },
])

const { dataList, isLoading, noMore, init, next, revert } = useInfinite('User.listArticle', {
  params: { type: GET_ARTICLE_LIST.BOUGHT },
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
</script>
