<template>
  <div class="sticky top-52 z-10 h-35 bg-white">
    <Tab v-model="tab" :options="tabOptions"></Tab>
  </div>
  <div v-show="tab === MINE_BUY_TAB.TRANSACTION">
    <TransactionList></TransactionList>
  </div>
  <div v-show="tab === MINE_BUY_TAB.SUBSCRIPTION">
    <SubCard></SubCard>
  </div>
  <div v-show="tab === MINE_BUY_TAB.PURCHASED_ARTICLE">
    <ArticleList :api="'User.listArticle'" :apiType="GET_ARTICLE_LIST.BOUGHT"></ArticleList>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import SubCard from '@comp/card/SubCard.vue'
import TransactionList from '@comp/mine/TransactionList.vue'
import Tab from '@comp/navigation/Tab.vue'
import { GET_ARTICLE_LIST, MINE_BUY_TAB } from '@const'
import ArticleList from '@/components/mine/ArticleList.vue'

const tab = ref(MINE_BUY_TAB.TRANSACTION)
const tabOptions = ref([
  { label: 'label.texn', value: MINE_BUY_TAB.TRANSACTION },
  { label: 'label.subs', value: MINE_BUY_TAB.SUBSCRIPTION },
  { label: 'label.artPur', value: MINE_BUY_TAB.PURCHASED_ARTICLE },
])
</script>
