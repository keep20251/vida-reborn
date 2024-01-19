<template>
  <Tab v-model="tab" :options="tabOptions" class="mt-10 !h-35"></Tab>
  <div v-if="tab === 1">
    <div class="flex justify-between pt-20">
      <div class="leading-md text-base font-bold">全部贴文 13</div>
      <Tab v-model="tabBtn" :options="tabBtnOptions" isBtnTab :isBasicTab="false"></Tab>
    </div>
    <div v-if="tabBtn === 1">
      <div class="overflow-x-hidden">
        <List :items="items" item-key="id">
          <template #default="{ last }">
            <Feed class="py-20"></Feed>
            <div v-if="!last" class="h-1 bg-black opacity-[0.15]"></div>
          </template>
          <template #bottom>
            <div class="flex items-center justify-center py-8 text-gray36">
              <Loading></Loading>{{ $t('common.noMore') }}
            </div>
          </template>
        </List>
      </div>
    </div>
    <div v-if="tabBtn === 2">影片</div>
  </div>
  <div v-else-if="tab === 2">
    <div class="flex justify-between pt-20">
      <div class="leading-md text-base font-bold">全部贴文 13</div>
      <Tab v-model="tabBtn" :options="tabBtnOptions" isBtnTab :isBasicTab="false"></Tab>
    </div>
    <div v-if="tabBtn === 1">
      <div class="overflow-x-hidden">
        <List :items="items" item-key="id">
          <template #default="{ last }">
            <Feed class="py-20"></Feed>
            <div v-if="!last" class="h-1 bg-black opacity-[0.15]"></div>
          </template>
          <template #bottom>
            <div class="flex items-center justify-center py-8 text-gray36">
              <Loading></Loading>{{ $t('common.noMore') }}
            </div>
          </template>
        </List>
      </div>
    </div>
    <div v-if="tabBtn === 2">影片</div>
  </div>
  <div v-else-if="tab === 3">
    <div class="flex justify-between pt-20">
      <!-- 審核通過會放入『# 已排入定時發佈』-->
      <div class="leading-md text-base font-bold"># 审核中</div>
      <Tab v-model="tabBtn" :options="tabBtnOptions" isBtnTab :isBasicTab="false"></Tab>
    </div>
    <div v-if="tabBtn === 1">
      <div class="overflow-x-hidden">
        <List :items="items" item-key="id">
          <template #default="{ last }">
            <Feed class="py-20"></Feed>
            <div v-if="!last" class="h-1 bg-black opacity-[0.15]"></div>
          </template>
          <template #bottom>
            <div class="flex items-center justify-center py-8 text-gray36">
              <Loading></Loading>{{ $t('common.noMore') }}
            </div>
          </template>
        </List>
      </div>
    </div>
    <div v-if="tabBtn === 2">影片</div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import Tab from '@comp/navigation/Tab.vue'
import List from '@comp/common/List.vue'
import Feed from '@comp/main/Feed.vue'
import Loading from '@comp/common/Loading.vue'

const tab = ref(1)
const tabOptions = ref([
  { label: '订阅', value: 1 },
  { label: '贩售', value: 2 },
  { label: '定时发布', value: 3 },
])

const tabBtn = ref(1)
const tabBtnOptions = ref([
  { label: '图片', value: 1 },
  { label: '视频', value: 2 },
])
const items = ref([{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }])
</script>
