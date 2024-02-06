<template>
  <Tab v-model="tab" :options="tabOptions" class="!h-35"></Tab>
  <div v-show="tab === MINE_COLLECT_TAB.ALL">
    <div class="pt-20 text-base font-bold leading-lg">{{ $t('content.allPosts') }} {{ dataList.length }}</div>
    <div class="overflow-x-hidden">
      <List :items="dataList" item-key="id" divider>
        <template #default="{ item }">
          <Feed class="py-20" :item="item"></Feed>
        </template>
        <template #bottom>
          <div class="flex items-center justify-center py-8 text-gray-a3">
            <Loading v-if="isLoading">{{ $t('common.loading') }}</Loading>
            <span v-if="noMore">{{ $t('common.noMore') }}</span>
          </div>
        </template>
      </List>
    </div>
  </div>
  <div v-show="tab === MINE_COLLECT_TAB.UNLOCKED">
    <div class="pt-20 text-base font-bold leading-lg">{{ $t('content.allPosts') }} 13</div>
    <div class="overflow-x-hidden">
      <List :items="items" item-key="id" divider>
        <template #default="{}">
          <Feed class="py-20"></Feed>
        </template>
        <template #bottom>
          <div class="flex items-center justify-center py-8 text-gray-a3">
            <Loading></Loading>{{ $t('common.noMore') }}
          </div>
        </template>
      </List>
    </div>
  </div>
  <div v-show="tab === MINE_COLLECT_TAB.NOT_UNLOCKED">
    <div class="pt-20 text-base font-bold leading-lg">{{ $t('content.allPosts') }} 13</div>
    <div class="overflow-x-hidden">
      <List :items="items" item-key="id" divider>
        <template #default="{}">
          <Feed class="py-20"></Feed>
        </template>
        <template #bottom>
          <div class="flex items-center justify-center py-8 text-gray-a3">
            <Loading></Loading>{{ $t('common.noMore') }}
          </div>
        </template>
      </List>
    </div>
  </div>
</template>
<script setup>
import { onActivated, onDeactivated, onMounted, onUnmounted, ref } from 'vue'
import { useMineStore } from '@/store/mine'
import List from '@comp/common/List.vue'
import Loading from '@comp/common/Loading.vue'
import Feed from '@comp/main/Feed.vue'
import Tab from '@comp/navigation/Tab.vue'
import { useInfinite } from '@use/request/infinite'
import { GET_ARTICLE_LIST, MINE_COLLECT_TAB } from '@const'

const tab = ref(MINE_COLLECT_TAB.ALL)
const tabOptions = ref([
  { label: 'label.all', value: MINE_COLLECT_TAB.ALL },
  { label: 'label.unlocked', value: MINE_COLLECT_TAB.UNLOCKED },
  { label: 'label.notUnlocked', value: MINE_COLLECT_TAB.NOT_UNLOCKED },
])

const { dataList, isLoading, noMore, init, next, revert } = useInfinite('User.listArticle', {
  params: { type: GET_ARTICLE_LIST.LICK },
})

const { setNextFn, clearNextFn } = useMineStore()
onMounted(() => {
  init()
  setNextFn(next)
})
onUnmounted(() => clearNextFn(next))
onActivated(() => {
  init()
  setNextFn(next)
})
onDeactivated(() => clearNextFn(next))
</script>
