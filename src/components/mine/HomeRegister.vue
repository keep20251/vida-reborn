<template>
  <div>
    <SelfIntro :item="userData" show-all-info></SelfIntro>
    <Tab v-model="tab" :options="tabOptions" class="mt-20 !h-35"></Tab>
    <div v-show="tab === MINE_HOME_REG.MINE_COLLECT_TAB">
      <ArticleList :api="'User.listArticle'" :apiType="GET_ARTICLE_LIST.LIKE"></ArticleList>
    </div>
    <div v-show="tab === MINE_HOME_REG.MINE_BUY_TAB">
      <ArticleList :api="'User.listArticle'" :apiType="GET_ARTICLE_LIST.BOUGHT"></ArticleList>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useAccountStore } from '@/store/account'
import SelfIntro from '@comp/main/SelfIntro.vue'
import Tab from '@comp/navigation/Tab.vue'
import { GET_ARTICLE_LIST, MINE_HOME_REG } from '@const'
import ArticleList from '@/components/mine/ArticleList.vue'

const { userData } = storeToRefs(useAccountStore())

const tab = ref(MINE_HOME_REG.MINE_COLLECT_TAB)
const tabOptions = ref([
  { label: 'title.mineCollect', value: MINE_HOME_REG.MINE_COLLECT_TAB },
  { label: 'title.mineBuy', value: MINE_HOME_REG.MINE_BUY_TAB },
])
</script>
