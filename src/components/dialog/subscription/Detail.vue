<template>
  <div class="select-none py-30 pl-20" :class="{ 'pr-5': isDesktop, 'pr-10': !isDesktop }">
    <div
      class="h-[65vh] max-h-[65vh] overflow-x-hidden overflow-y-scroll"
      :class="{ 'hover-scrollbar': isDesktop, 'scrollbar pr-10': !isDesktop }"
    >
      <div class="pr-5">
        <div class="flex flex-col space-y-20">
          <div>
            <div class="flex flex-col space-y-10">
              <div class="flex justify-between">
                <div class="text-lg font-bold leading-lg">{{ $t('dialog.subscription.detail.choose') }}</div>
                <div v-if="activeSubscription.is_subscribe" class="text-sm font-bold leading-3 text-primary">
                  {{ $t('dialog.subscription.detail.owned') }}
                </div>
                <div
                  v-else
                  class="cursor-pointer text-sm font-bold leading-3 text-primary"
                  @click="subscribe({ creator, item: activeSubscription })"
                >
                  {{ $t('common.buy') }}
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
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/store/app'
import { useSubsciptionStore } from '@/store/subscription'
import Divider from '@/components/common/Divider.vue'
import TagGroup from '@/components/common/TagGroup.vue'
import ContainFeedList from '@/components/subscription/ContainFeedList.vue'
import { useDialog } from '@/compositions/modal'
import { SUBSCRIPTION_ARTICLE_TYPE } from '@/constant'

const { isDesktop } = storeToRefs(useAppStore())
const { activeSubscription, subscriptions, creator } = storeToRefs(useSubsciptionStore())
const { subscribe } = useDialog()
</script>
