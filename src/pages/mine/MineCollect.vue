<template>
  <div class="sticky top-52 z-10 h-35 bg-white">
    <Tab v-model="tab" :options="tabOptions"></Tab>
  </div>
  <div v-show="tab === MINE_COLLECT_TAB.ALL">
    <ArticleList :api="'User.listArticle'" :apiType="GET_ARTICLE_LIST.LIKE"></ArticleList>
  </div>
  <div v-show="tab === MINE_COLLECT_TAB.UNLOCKED">
    <ArticleList
      :api="'User.listArticle'"
      :apiType="GET_ARTICLE_LIST.LIKE"
      :apiParams="GET_ARTICLE_COLLECT.UNLOCKED"
    ></ArticleList>
  </div>
  <div v-show="tab === MINE_COLLECT_TAB.NOT_UNLOCKED">
    <ArticleList
      :api="'User.listArticle'"
      :apiType="GET_ARTICLE_LIST.LIKE"
      :apiParams="GET_ARTICLE_COLLECT.NOT_UNLOCKED"
    ></ArticleList>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import Tab from '@comp/navigation/Tab.vue'
import { GET_ARTICLE_COLLECT, GET_ARTICLE_LIST, MINE_COLLECT_TAB } from '@const'
import ArticleList from '@/components/mine/ArticleList.vue'

const tab = ref(MINE_COLLECT_TAB.ALL)
const tabOptions = ref([
  { label: 'label.all', value: MINE_COLLECT_TAB.ALL },
  { label: 'label.unlocked', value: MINE_COLLECT_TAB.UNLOCKED },
  { label: 'label.notUnlocked', value: MINE_COLLECT_TAB.NOT_UNLOCKED },
])
</script>
