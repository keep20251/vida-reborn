<template>
  <div>
    <SelfIntro :item="userData" show-all-info></SelfIntro>
    <Tab v-model="tab" :options="tabOptions" class="mt-20 !h-35"></Tab>
    <div v-show="tab === TAB_TYPE.REC">
      <div class="overflow-x-hidden">
        <List :items="recPosts" item-key="id" divider>
          <template #default="{ item }">
            <Feed class="py-20" :item="item"></Feed>
          </template>
          <template #bottom>
            <div class="flex items-center justify-center py-8 text-gray-a3">
              <Loading v-if="recPostsIsLoading">{{ $t('common.loading') }}</Loading>
              <span v-if="recPostsNoMore">{{ $t('common.noMore') }}</span>
            </div>
          </template>
        </List>
      </div>
    </div>
    <div v-show="tab === TAB_TYPE.SUB">
      <div class="flex justify-between pt-20">
        <div class="text-base font-bold leading-md">{{ $t('info.popularCreator') }}</div>
        <Icon @click="creatorsReload" name="filter" size="20" class="cursor-pointer"></Icon>
      </div>
      <div class="pt-10 text-base font-normal leading-md">{{ $t('info.subscribeToView') }}</div>
      <div class="flex flex-col justify-center space-y-10 pt-30">
        <List :items="creators" item-key="aff">
          <template #default="{ item, index }">
            <ViewSubscribeCard class="my-5" :item="item" :theme="(index + 2) % 3"></ViewSubscribeCard>
          </template>
          <template #bottom>
            <div class="flex items-center justify-center py-8 text-gray-a3">
              <Loading v-if="creatorsIsLoading"></Loading>
              <span v-if="creatorsNoMore">{{ $t('common.noMore') }}</span>
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
import { useFeedStore } from '@/store/feed'
import { useMineStore } from '@/store/mine'
import ViewSubscribeCard from '@comp/card/ViewSubscribeCard.vue'
import Feed from '@comp/main/Feed.vue'
import SelfIntro from '@comp/main/SelfIntro.vue'
import Tab from '@comp/navigation/Tab.vue'
import { useInfinite } from '@use/request/infinite'
import { TAB_TYPE } from '@const/home'

const { t: $t } = useI18n()
const { userData } = storeToRefs(useAccountStore())

const tab = ref(TAB_TYPE.REC)
const tabOptions = ref([
  { label: 'tab.recommand', value: TAB_TYPE.REC },
  { label: 'tab.subscribe', value: TAB_TYPE.SUB },
])

const {
  dataList: creators,
  isLoading: creatorsIsLoading,
  noMore: creatorsNoMore,
  init: creatorsInit,
  next: creatorsNext,
  reload: creatorsReload,
} = useInfinite('User.searchCreator')

const feedStore = useFeedStore()
const {
  dataList: recPosts,
  isLoading: recPostsIsLoading,
  noMore: recPostsNoMore,
  init: recPostsInit,
  next: recPostsNext,
} = useInfinite('Article.list', {
  params: { filter_by: 0, user_interested: 1, include_my_article: 1 },
  transformer: feedStore.sync,
})

const { setNextFn, clearNextFn } = useMineStore()

onMounted(() => {
  recPostsInit()
  creatorsInit()
})
onUnmounted(() => clearNextFn(recPostsNext, creatorsNext))
onActivated(() => setNextFn(recPostsNext, creatorsNext))
onDeactivated(() => clearNextFn(recPostsNext, creatorsNext))
</script>
