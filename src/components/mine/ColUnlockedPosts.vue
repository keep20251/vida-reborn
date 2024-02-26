<template>
  <div>
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
</template>
<script setup>
import { onActivated, onDeactivated, onMounted, onUnmounted } from 'vue'
import { useMineStore } from '@/store/mine'
import Feed from '@comp/main/Feed.vue'
import { useInfinite } from '@use/request/infinite'
import { GET_ARTICLE_COLLECT, GET_ARTICLE_LIST } from '@const'

const {
  dataList: unlockedArticleList,
  dataExtra: unlockedArticleExtra,
  isLoading: unlockedArticleLoading,
  noMore: unlockedArticleNoMore,
  init: unlockedArticleInit,
  next: unlockedArticleNext,
  reload: unlockedArticleReload,
} = useInfinite('User.listArticle', {
  params: { type: GET_ARTICLE_LIST.LIKE, unlock: GET_ARTICLE_COLLECT.UNLOCKED },
})

const { setNextFn, clearNextFn } = useMineStore()
onMounted(() => {
  unlockedArticleReload()
})
onUnmounted(() => clearNextFn(unlockedArticleNext))
onActivated(() => {
  setNextFn(unlockedArticleNext)
  unlockedArticleReload()
})
onDeactivated(() => clearNextFn(unlockedArticleNext))
</script>
