<template>
  <div class="flex flex-col space-y-20 pb-20 pl-20 pt-10" :class="{ 'pr-6': isDesktop, ' pr-10': !isDesktop }">
    <div class="h-44">
      <Tab v-model="currentTab" :options="tabOptions"></Tab>
    </div>
    <div class="text-sm font-normal leading-3 text-gray-a3">{{ $t(infoText) }}</div>
    <div
      class="max-h-[65vh] overflow-y-auto"
      :class="{ 'hover-scrollbar pr-6': isDesktop, 'scrollbar pr-10': !isDesktop }"
    >
      <div v-if="disabled" class="animate-pulse-none mb-40 flex w-full flex-col space-y-10">
        <div class="h-27 rounded-md bg-gray-a3"></div>
        <div class="h-[11.875rem] rounded-md bg-gray-a3"></div>
        <div class="flex justify-between">
          <div class="h-12 w-100 rounded-md bg-gray-a3"></div>
          <div class="h-12 w-100 rounded-md bg-gray-a3"></div>
        </div>
        <div class="h-18 rounded-md bg-gray-a3"></div>
        <div class="h-36 rounded-full bg-gray-a3"></div>
      </div>
      <List v-else :items="data" item-key="id" divider>
        <template #default="{ item }">
          <SubscribeCard
            class="my-20"
            :item="item"
            show-contain
            :height="260"
            @click="subscribe({ item, creator })"
            @click:contain="onContainClicked"
          ></SubscribeCard>
        </template>
        <template #bottom>
          <div v-if="data && data?.length > 0" class="flex items-center justify-center py-8 text-gray-a3">
            <Loading v-if="isLoading"></Loading>
            <span v-else>{{ $t('common.noMore') }}</span>
          </div>
          <NoData v-else :reload="() => onExecute(() => fetchData(currentTab))"></NoData>
        </template>
      </List>
    </div>
  </div>
</template>
<script setup>
import { computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/store/app'
import { useSubsciptionStore } from '@/store/subscription'
import SubscribeCard from '@/components/card/SubscribeCard.vue'
import NoData from '@/components/info/NoData.vue'
import Tab from '@/components/navigation/Tab.vue'
import { useDialog } from '@/compositions/modal'
import useRequest from '@/compositions/request'
import { useExecutionLock } from '@/compositions/utils/execution-lock'
import { SUBSCRIPTION_TYPE } from '@/constant'

const { isDesktop } = storeToRefs(useAppStore())
const { subscribe } = useDialog()

const subscriptionStore = useSubsciptionStore()
const { openDetail } = subscriptionStore
const { isOpen, currentTab, feed, creator } = storeToRefs(subscriptionStore)
const infoText = computed(() =>
  currentTab.value === SUBSCRIPTION_TYPE.RECOMMEND ? 'info.subscription.recommend' : 'info.subscription.other',
)

const tabOptions = [
  { label: 'tab.subscription.recommend', value: SUBSCRIPTION_TYPE.RECOMMEND },
  { label: 'tab.subscription.other', value: SUBSCRIPTION_TYPE.OTHER },
]

const { data, isLoading, execute } = useRequest('Subscription.getArticleSubscription')

const { disabled, onExecute } = useExecutionLock()
const fetchData = (_tab) => execute({ article_id: feed.value.id, rmd: _tab })

watch([isOpen, currentTab], ([_isOpen, _tab]) => (_isOpen ? onExecute(() => fetchData(_tab)) : void 0), {
  immediate: true,
})
const onContainClicked = async (item) => {
  const allSubscriptions = await useRequest('Subscription.getArticleSubscription', {
    immediate: true,
    params: { article_id: feed.value.id, rmd: SUBSCRIPTION_TYPE.ALL },
  })
  openDetail({ activeSubscription: item, subscriptions: allSubscriptions })
}
</script>
