<template>
  <BaseDialog v-if="isOpen" no-padding @click:around="close">
    <template #default>
      <div class="h-full w-full rounded-xl">
        <div class="relative flex w-full items-center justify-center rounded-t-xl bg-primary py-16">
          <div class="text-lg font-bold leading-lg text-white">
            {{ $t('title.subscription') }}
          </div>
          <div class="absolute right-0 top-0 cursor-pointer pr-15 pt-15">
            <Icon name="closeWhite" size="20" @click="close"></Icon>
          </div>
        </div>
        <div class="flex flex-col space-y-20 px-20 pb-20 pt-10">
          <div class="h-44">
            <Tab v-model="currentTab" :options="tabOptions"></Tab>
          </div>
          <div class="text-sm font-normal leading-3 text-gray-a3">{{ $t(infoText) }}</div>
          <div class="scrollbar-md max-h-[65vh] overflow-y-scroll pr-20">
            <List :items="data" item-key="id" divider>
              <template #default="{ item }">
                <SubscribeCard :item="item" @click="subscribe({ item, creator })"></SubscribeCard>
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
      </div>
    </template>
  </BaseDialog>
</template>
<script setup>
import { computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useFeedSubscriptionStore } from '@/store/feed-subscription'
import { useDialog } from '@/compositions/modal'
import useRequest from '@/compositions/request'
import { SUBSCRIPTION_TYPE } from '@/constant'
import SubscribeCard from '../card/SubscribeCard.vue'
import NoData from '../info/NoData.vue'
import Tab from '../navigation/Tab.vue'
import BaseDialog from './BaseDialog.vue'

const { subscribe } = useDialog()

const feedSubscriptionStore = useFeedSubscriptionStore()
const { close } = feedSubscriptionStore
const { isOpen, currentTab, feed, creator } = storeToRefs(feedSubscriptionStore)
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
