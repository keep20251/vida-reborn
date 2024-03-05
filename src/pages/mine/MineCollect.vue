<template>
  <div class="sticky top-52 z-10 h-35 bg-white">
    <Tab v-model="tab" :options="tabOptions"></Tab>
  </div>
  <div v-show="tab === MINE_COLLECT_TAB.ALL">
    <ColArticle></ColArticle>
  </div>
  <div v-show="tab === MINE_COLLECT_TAB.UNLOCKED">
    <ColArticle :apiParams="GET_ARTICLE_COLLECT.UNLOCKED"></ColArticle>
  </div>
  <div v-show="tab === MINE_COLLECT_TAB.NOT_UNLOCKED">
    <ColArticle :apiParams="GET_ARTICLE_COLLECT.NOT_UNLOCKED"></ColArticle>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import ColArticle from '@comp/mine/ColArticle.vue'
import Tab from '@comp/navigation/Tab.vue'
import { GET_ARTICLE_COLLECT, MINE_COLLECT_TAB } from '@const'

const tab = ref(MINE_COLLECT_TAB.ALL)
const tabOptions = ref([
  { label: 'label.all', value: MINE_COLLECT_TAB.ALL },
  { label: 'label.unlocked', value: MINE_COLLECT_TAB.UNLOCKED },
  { label: 'label.notUnlocked', value: MINE_COLLECT_TAB.NOT_UNLOCKED },
])
</script>
