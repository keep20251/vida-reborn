<template>
  <div>
    <SelfIntro :item="userData" show-all-info></SelfIntro>
    <Tab v-model="tab" :options="tabOptions" class="mt-20 !h-35"></Tab>
    <div v-show="tab === MINE_HOME_REG.MINE_COLLECT_TAB">
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
    <div v-show="tab === MINE_HOME_REG.MINE_BUY_TAB">
      <div class="pt-20 text-base font-bold leading-lg">{{ $t('content.allPosts') }} {{ buyArticleExtra?.total }}</div>
      <div class="overflow-x-hidden">
        <List :items="buyArticleList" item-key="id" divider>
          <template #default="{ item }">
            <Feed class="py-20" :item="item"></Feed>
          </template>
          <template #bottom>
            <div class="flex items-center justify-center py-8 text-gray-a3">
              <Loading v-if="buyArticleLoading">{{ $t('common.loading') }}</Loading>
              <span v-if="buyArticleNoMore">{{ $t('common.noMore') }}</span>
            </div>
          </template>
        </List>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onActivated, onDeactivated, onMounted, onUnmounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useAccountStore } from '@/store/account'
import { useMineStore } from '@/store/mine'
import Feed from '@comp/main/Feed.vue'
import SelfIntro from '@comp/main/SelfIntro.vue'
import Tab from '@comp/navigation/Tab.vue'
import { useInfinite } from '@use/request/infinite'
import { GET_ARTICLE_LIST, MINE_HOME_REG } from '@const'

const { t: $t } = useI18n()
const { userData } = storeToRefs(useAccountStore())

const tab = ref(MINE_HOME_REG.MINE_COLLECT_TAB)
const tabOptions = ref([
  { label: 'title.mineCollect', value: MINE_HOME_REG.MINE_COLLECT_TAB },
  { label: 'title.mineBuy', value: MINE_HOME_REG.MINE_BUY_TAB },
])

const {
  dataList: allArticleList,
  dataExtra: allArticleExtra,
  isLoading: allArticleLoading,
  noMore: allArticleNoMore,
  next: allArticleNext,
  reload: allArticleReload,
} = useInfinite('User.listArticle', {
  params: { type: GET_ARTICLE_LIST.LIKE },
})

const {
  dataList: buyArticleList,
  dataExtra: buyArticleExtra,
  isLoading: buyArticleLoading,
  noMore: buyArticleNoMore,
  next: buyArticleNext,
  reload: buyArticleReload,
} = useInfinite('User.listArticle', {
  params: { type: GET_ARTICLE_LIST.BOUGHT },
})

const { setNextFn, clearNextFn } = useMineStore()
onMounted(() => {
  allArticleReload()
  buyArticleReload()
})
onUnmounted(() => clearNextFn(allArticleNext, buyArticleNext))
onActivated(() => {
  setNextFn(allArticleNext, buyArticleNext)
  allArticleReload()
})
onDeactivated(() => clearNextFn(allArticleNext, buyArticleNext))
</script>
