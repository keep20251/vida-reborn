<template>
  <Tab v-model="tab" :options="tabOptions" class="!h-35"></Tab>
  <div v-show="tab === MINE_COLLECT_TAB.ALL">
    <div class="pt-20 text-base font-bold leading-lg">{{ $t('content.allPosts') }} {{ allArticleExtra?.total }}</div>
    <div class="overflow-x-hidden">
      <List :items="allArticleList" item-key="id" divider>
        <template #default="{ item }">
          <Feed class="py-20" :item="item"></Feed>
        </template>
        <template #bottom>
          <div class="flex items-center justify-center py-8 text-gray-a3">
            <Loading v-if="allArticleLoading">{{ $t('common.loading') }}</Loading>
            <span v-if="allArticleNoMore">{{ $t('common.noMore') }}</span>
          </div>
        </template>
      </List>
    </div>
  </div>
  <div v-show="tab === MINE_COLLECT_TAB.UNLOCKED">
    <div class="pt-20 text-base font-bold leading-lg">
      {{ $t('content.allPosts') }} {{ unlockedArticleExtra?.total }}
    </div>
    <div class="overflow-x-hidden">
      <List :items="unlockedArticleList" item-key="id" divider>
        <template #default="{ item }">
          <Feed class="py-20" :item="item"></Feed>
        </template>
        <template #bottom>
          <div class="flex items-center justify-center py-8 text-gray-a3">
            <Loading v-if="unlockedArticleLoading">{{ $t('common.loading') }}</Loading>
            <span v-if="unlockedArticleNoMore">{{ $t('common.noMore') }}</span>
          </div>
        </template>
      </List>
    </div>
  </div>
  <div v-show="tab === MINE_COLLECT_TAB.NOT_UNLOCKED">
    <div class="pt-20 text-base font-bold leading-lg">
      {{ $t('content.allPosts') }} {{ notUnlockedArticleExtra?.total }}
    </div>
    <div class="overflow-x-hidden">
      <List :items="notUnlockedArticleList" item-key="id" divider>
        <template #default="{ item }">
          <Feed class="py-20" :item="item"></Feed>
        </template>
        <template #bottom>
          <div class="flex items-center justify-center py-8 text-gray-a3">
            <Loading v-if="notUnlockedArticleLoading">{{ $t('common.loading') }}</Loading>
            <span v-if="notUnlockedArticleNoMore">{{ $t('common.noMore') }}</span>
          </div>
        </template>
      </List>
    </div>
  </div>
</template>
<script setup>
import { onActivated, onDeactivated, onMounted, onUnmounted, ref } from 'vue'
import { useMineStore } from '@/store/mine'
import Feed from '@comp/main/Feed.vue'
import Tab from '@comp/navigation/Tab.vue'
import { useInfinite } from '@use/request/infinite'
import { GET_ARTICLE_COLLECT, GET_ARTICLE_LIST, MINE_COLLECT_TAB } from '@const'

const tab = ref(MINE_COLLECT_TAB.ALL)
const tabOptions = ref([
  { label: 'label.all', value: MINE_COLLECT_TAB.ALL },
  { label: 'label.unlocked', value: MINE_COLLECT_TAB.UNLOCKED },
  { label: 'label.notUnlocked', value: MINE_COLLECT_TAB.NOT_UNLOCKED },
])

const {
  dataList: allArticleList,
  dataExtra: allArticleExtra,
  isLoading: allArticleLoading,
  noMore: allArticleNoMore,
  init: allArticleInit,
  next: allArticleNext,
} = useInfinite('User.listArticle', {
  params: { type: GET_ARTICLE_LIST.LIKE },
})

const {
  dataList: unlockedArticleList,
  dataExtra: unlockedArticleExtra,
  isLoading: unlockedArticleLoading,
  noMore: unlockedArticleNoMore,
  init: unlockedArticleInit,
  next: unlockedArticleNext,
} = useInfinite('User.listArticle', {
  params: { type: GET_ARTICLE_LIST.LIKE, unlock: GET_ARTICLE_COLLECT.UNLOCKED },
})

const {
  dataList: notUnlockedArticleList,
  dataExtra: notUnlockedArticleExtra,
  isLoading: notUnlockedArticleLoading,
  noMore: notUnlockedArticleNoMore,
  init: notUnlockedArticleInit,
  next: notUnlockedArticleNext,
} = useInfinite('User.listArticle', {
  params: { type: GET_ARTICLE_LIST.LIKE, unlock: GET_ARTICLE_COLLECT.NOT_UNLOCKED },
})

const { setNextFn, clearNextFn } = useMineStore()
onMounted(() => {
  allArticleInit()
  unlockedArticleInit()
  notUnlockedArticleInit()
  setNextFn(allArticleNext, unlockedArticleNext, notUnlockedArticleNext)
})
onUnmounted(() => clearNextFn(allArticleNext, unlockedArticleNext, notUnlockedArticleNext))
onActivated(() => {
  allArticleInit()
  unlockedArticleInit()
  notUnlockedArticleInit()
  setNextFn(allArticleNext, unlockedArticleNext, notUnlockedArticleNext)
})
onDeactivated(() => clearNextFn(allArticleNext, unlockedArticleNext, notUnlockedArticleNext))
</script>
