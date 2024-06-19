<template>
  <div class="flex flex-col space-y-20 px-20 pb-20 pt-10">
    <div class="h-44">
      <Tab v-model="currentTab" :options="tabOptions"></Tab>
    </div>
    <div class="text-sm font-normal leading-3 text-gray-a3">{{ $t(infoText) }}</div>
    <div class="scrollbar-md max-h-[65vh] overflow-y-scroll pr-20">
      <List :items="data" item-key="id" divider>
        <template #default="{ item }">
          <div class="py-20">
            <SubscribeCard :item="item" @click="subscribe({ item, creator })"></SubscribeCard>
          </div>
        </template>
        <template #bottom>
          <NoData v-if="data?.length <= 0"></NoData>
          <div v-else class="flex items-center justify-center py-8 text-gray-a3">
            <Loading v-if="isLoading"></Loading>
            <span v-else>{{ $t('common.noMore') }}</span>
          </div>
        </template>
      </List>
    </div>
  </div>
</template>
<script setup>
import { computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useSubsciptionStore } from '@/store/subscription'
import SubscribeCard from '@/components/card/SubscribeCard.vue'
import List from '@/components/common/List.vue'
import Loading from '@/components/common/Loading.vue'
import NoData from '@/components/info/NoData.vue'
import Tab from '@/components/navigation/Tab.vue'
import { useDialog } from '@/compositions/modal'
import useRequest from '@/compositions/request'
import { SUBSCRIPTION_TYPE } from '@/constant'

const { subscribe } = useDialog()

const subscriptionStore = useSubsciptionStore()
const { isOpen, currentTab, feed, creator } = storeToRefs(subscriptionStore)
const infoText = computed(() =>
  currentTab.value === SUBSCRIPTION_TYPE.RECOMMEND ? 'info.subscription.recommend' : 'info.subscription.other',
)

const tabOptions = [
  { label: 'tab.subscription.recommend', value: SUBSCRIPTION_TYPE.RECOMMEND },
  { label: 'tab.subscription.other', value: SUBSCRIPTION_TYPE.OTHER },
]

const { data, isLoading, execute } = useRequest('Subscription.getArticleSubscription')
watch(
  [isOpen, currentTab],
  ([_isOpen, _tab]) => (_isOpen ? execute({ article_id: feed.value.id, rmd: _tab }) : void 0),
  { immediate: true },
)
</script>
