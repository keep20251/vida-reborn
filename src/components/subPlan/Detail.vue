<template>
  <div class="flex h-full w-full flex-col">
    <div class="relative rounded-t-xl bg-primary px-20 py-15 text-center text-white">
      <div class="text-lg font-bold leading-5">
        {{ $t('common.viewSubscribePlan') }}
      </div>
      <button @click="back" :history="history" :show-back="showBack" class="absolute left-0 top-1/3 pl-20">
        <Icon name="backWhite"></Icon>
      </button>
      <button @click="close" class="absolute right-0 top-1/3 pr-20">
        <Icon name="closeWhite"></Icon>
      </button>
    </div>
    <div class="select-none p-30" :class="{ 'pr-10': isDesktop, 'pr-15': !isDesktop }">
      <div
        class="h-[65vh] overflow-y-auto"
        :class="{ 'my-10': subList.length === 0, 'hover-scrollbar pr-10': isDesktop, 'scrollbar pr-15': !isDesktop }"
      >
        <div class="flex flex-col space-y-20">
          <div>
            <div class="flex flex-col space-y-10">
              <div class="flex justify-between">
                <div class="text-lg font-bold leading-lg">{{ $t('dialog.subscription.detail.choose') }}</div>
                <div class="text-sm font-bold leading-3 text-primary">
                  {{ $t('dialog.subscription.detail.owned') }}
                </div>
              </div>
              <div class="text-sm font-normal leading-3 text-gray-a3">
                {{ $t('dialog.subscription.detail.fromCreator') }}
              </div>
            </div>
            <TagGroup
              v-model="activeSubscription"
              :items="subscriptions"
              item-value="id"
              item-label="name"
              enable-active-theme
            ></TagGroup>
          </div>
          <Divider></Divider>
          <ContainFeedList :feed-id="activeSubscription.id" :article-type="SUBSCRIPTION_ARTICLE_TYPE.CONTAIN">
            <template #text>
              <div class="flex flex-col space-y-10">
                <div class="flex justify-between">
                  <div class="text-lg font-bold leading-lg">{{ $t('dialog.subscription.detail.containFeeds') }}</div>
                  <div class="text-sm font-normal leading-3 text-primary">
                    {{ $t('dialog.subscription.detail.containTag', { count: activeSubscription.article_contain }) }}
                  </div>
                </div>
                <div class="text-sm font-normal leading-3 text-gray-a3">
                  {{ $t('dialog.subscription.detail.containInfo') }}
                </div>
              </div>
            </template>
          </ContainFeedList>
          <Divider></Divider>
          <ContainFeedList :feed-id="activeSubscription.id" :article-type="SUBSCRIPTION_ARTICLE_TYPE.EXPIRED">
            <template #text>
              <div class="flex flex-col space-y-10">
                <div class="flex justify-between">
                  <div class="text-lg font-bold leading-lg">{{ $t('common.expired') }}</div>
                  <div class="text-sm font-normal leading-3 text-primary">
                    {{ $t('dialog.subscription.detail.expiredTag') }}
                  </div>
                </div>
                <div class="text-sm font-normal leading-3 text-gray-a3">
                  {{ $t('dialog.subscription.detail.expiredInfo') }}
                </div>
              </div>
            </template>
          </ContainFeedList>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/store/app'
import { useSubPlanStore } from '@/store/sub-plan'
import Divider from '@/components/common/Divider.vue'
import TagGroup from '@/components/common/TagGroup.vue'
import ContainFeedList from '@/components/subscription/ContainFeedList.vue'
import { SUBSCRIPTION_ARTICLE_TYPE } from '@/constant'

const { isDesktop } = storeToRefs(useAppStore())

const { close, back } = useSubPlanStore()
const showBack = computed(() => history.value.length > 0)
const { history, index: i, subList, activeSubscription, subscriptions } = storeToRefs(useSubPlanStore())
</script>
