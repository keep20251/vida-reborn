<template>
  <div>
    <div class="pt-20 text-base font-bold leading-lg">{{ $t('content.allPosts') }} {{ total?.['total'] }}</div>
    <div class="overflow-x-hidden">
      <List :items="dataList" item-key="id" divider>
        <template #default="{ item }">
          <Feed class="py-20" :item="item"></Feed>
        </template>
        <template #bottom>
          <NoData v-if="noData"></NoData>
          <div v-else class="flex items-center justify-center py-8 text-gray-a3">
            <Loading v-if="isLoading">{{ $t('common.loading') }}</Loading>
            <span v-if="noMore">{{ $t('common.noMore') }}</span>
          </div>
        </template>
      </List>
    </div>
  </div>
</template>

<script setup>
import { onActivated, onDeactivated, onMounted, onUnmounted } from 'vue'
import { useFeedStore } from '@/store/feed'
import { useMineStore } from '@/store/mine'
import NoData from '@comp/info/NoData.vue'
import Feed from '@comp/main/Feed.vue'
import { useInfinite } from '@use/request/infinite'

const props = defineProps({
  api: {
    type: String,
    required: true,
  },
  apiType: {
    type: Number,
  },
  apiParams: {
    type: Number,
  },
})

const feedStore = useFeedStore()
const {
  dataList,
  dataExtra: total,
  isLoading,
  noMore,
  noData,
  init,
  next,
  reload,
} = useInfinite(props.api, {
  params: { type: props.apiType, unlock: props.apiParams },
  transformer: feedStore.sync,
})

// 因為手機版這邊會被隱藏，所以就沒有加上 setReloadFn, clearReloadFn
const { setNextFn, clearNextFn } = useMineStore()
onMounted(() => init())
onUnmounted(() => clearNextFn(next))
onActivated(() => {
  setNextFn(next)
  reload()
})
onDeactivated(() => clearNextFn(next))
</script>
