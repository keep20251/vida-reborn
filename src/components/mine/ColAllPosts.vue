<template>
  <div>
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
</template>
<script setup>
import { onActivated, onDeactivated, onMounted, onUnmounted } from 'vue'
import { useMineStore } from '@/store/mine'
import Feed from '@comp/main/Feed.vue'
import { useInfinite } from '@use/request/infinite'
import { GET_ARTICLE_LIST } from '@const'

const {
  dataList: allArticleList,
  dataExtra: allArticleExtra,
  isLoading: allArticleLoading,
  noMore: allArticleNoMore,
  init: allArticleInit,
  next: allArticleNext,
  reload: allArticleReload,
} = useInfinite('User.listArticle', {
  params: { type: GET_ARTICLE_LIST.LIKE },
})

const { setNextFn, clearNextFn } = useMineStore()
onMounted(() => {
  allArticleReload()
})
onUnmounted(() => clearNextFn(allArticleNext))
onActivated(() => {
  setNextFn(allArticleNext)
  allArticleReload()
})
onDeactivated(() => clearNextFn(allArticleNext))
</script>
