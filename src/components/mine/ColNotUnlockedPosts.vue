<template>
  <div>
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
import { onActivated, onDeactivated, onMounted, onUnmounted } from 'vue'
import { useMineStore } from '@/store/mine'
import Feed from '@comp/main/Feed.vue'
import { useInfinite } from '@use/request/infinite'
import { GET_ARTICLE_COLLECT, GET_ARTICLE_LIST } from '@const'

const {
  dataList: notUnlockedArticleList,
  dataExtra: notUnlockedArticleExtra,
  isLoading: notUnlockedArticleLoading,
  noMore: notUnlockedArticleNoMore,
  init: notUnlockedArticleInit,
  next: notUnlockedArticleNext,
  reload: notUnlockedArticleReload,
} = useInfinite('User.listArticle', {
  params: { type: GET_ARTICLE_LIST.LIKE, unlock: GET_ARTICLE_COLLECT.NOT_UNLOCKED },
})

const { setNextFn, clearNextFn } = useMineStore()
onMounted(() => {
  notUnlockedArticleReload()
})
onUnmounted(() => clearNextFn(notUnlockedArticleNext))
onActivated(() => {
  setNextFn(notUnlockedArticleNext)
  notUnlockedArticleReload()
})
onDeactivated(() => clearNextFn(notUnlockedArticleNext))
</script>
