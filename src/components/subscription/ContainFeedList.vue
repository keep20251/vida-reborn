<template>
  <div class="flex flex-col space-y-20">
    <slot name="text"></slot>
    <List :items="dataList">
      <template #default="{ item }">
        <ContainFeed :item="item"></ContainFeed>
      </template>
      <template #bottom>
        <div ref="el">
          <NoData v-if="noData"></NoData>
          <div v-else class="flex items-center justify-center py-8 text-gray-a3">
            <Loading v-if="isLoading">{{ $t('common.loading') }}</Loading>
            <span v-if="noMore">{{ $t('common.noMore') }}</span>
          </div>
        </div>
      </template>
    </List>
  </div>
</template>
<script setup>
import { onMounted, ref, watch } from 'vue'
import { useInfinite } from '@/compositions/request/infinite'
import { useIntersection } from '@/compositions/utils/intersection'
import List from '../common/List.vue'
import Loading from '../common/Loading.vue'
import NoData from '../info/NoData.vue'
import ContainFeed from './ContainFeed.vue'

const props = defineProps({
  feedId: { type: Number, required: true },
  articleType: { type: Number, required: true },
})

const { dataList, isLoading, noMore, noData, init, reload, next } = useInfinite(
  'Subscription.getSubscriptionArticles',
  {
    params: {
      subscription_id: props.feedId,
      subscription_unlock: props.articleType,
    },
  },
)

const el = ref(null)
useIntersection(el, {
  onEnter: () => (!isLoading.value && !noMore.value ? next() : void 0),
  onLeave: () => {},
})

onMounted(() => init())
watch(
  () => props.feedId,
  (v) => reload({ newParams: { subscription_id: v, subscription_unlock: props.articleType } }),
)
</script>
