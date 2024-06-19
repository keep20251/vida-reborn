<template>
  <div class="select-none px-20 py-30">
    <div class="scrollbar-md h-[65vh] max-h-[65vh] overflow-x-hidden overflow-y-scroll">
      <div class="pr-20">
        <div class="flex flex-col space-y-20">
          <div>
            <div class="flex flex-col space-y-10">
              <div class="flex justify-between">
                <div class="text-lg font-bold leading-lg">方案選擇</div>
                <div
                  class="text-sm font-bold leading-3 text-primary"
                  :class="{ 'cursor-pointer': !activeSubscription.is_subscribe }"
                >
                  {{ subscriptionStatusText }}
                </div>
              </div>
              <div class="text-sm font-normal leading-3 text-gray-a3">創作者提供之訂閱方案</div>
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
                  <div class="text-lg font-bold leading-lg">包含帖子</div>
                  <div class="text-sm font-normal leading-3 text-primary">
                    #包含{{ activeSubscription.article_contain }}篇訂閱帖子
                  </div>
                </div>
                <div class="text-sm font-normal leading-3 text-gray-a3">訂閱方案後，即可觀看下列帖子</div>
              </div>
            </template>
          </ContainFeedList>
          <Divider></Divider>
          <!-- <div>
            <pre>{{ activeSubscription }}</pre>
          </div>
          <div>
            <pre>{{ subscriptions }}</pre>
          </div> -->
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useSubsciptionStore } from '@/store/subscription'
import Divider from '@/components/common/Divider.vue'
import TagGroup from '@/components/common/TagGroup.vue'
import ContainFeedList from '@/components/subscription/ContainFeedList.vue'
import { SUBSCRIPTION_ARTICLE_TYPE } from '@/constant'

const { activeSubscription, subscriptions } = storeToRefs(useSubsciptionStore())
const subscriptionStatusText = computed(() => (activeSubscription.value.is_subscribe ? '已擁有此方案' : '購買'))
</script>
