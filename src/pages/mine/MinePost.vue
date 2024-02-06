<template>
  <Tab v-model="tab" :options="tabOptions" class="!h-35"></Tab>
  <div v-if="tab === 1">
    <div class="flex justify-between pt-20">
      <div class="text-base font-bold leading-md">{{ $t('content.allPosts') }}{{ allPosts }}</div>
      <Tab v-model="tabBtn" :options="tabBtnOptions" isBtnTab :isBasicTab="false"></Tab>
    </div>
    <div v-if="tabBtn === 1">
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
    <div v-if="tabBtn === 2">{{ $t('info.video') }}</div>
  </div>
  <div v-else-if="tab === 2">
    <div class="flex justify-between pt-20">
      <div class="text-base font-bold leading-md">{{ $t('content.allPosts') }}{{ allPosts }}</div>
      <Tab v-model="tabBtn" :options="tabBtnOptions" isBtnTab :isBasicTab="false"></Tab>
    </div>
    <div v-if="tabBtn === 1">
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
    <div v-if="tabBtn === 2">{{ $t('info.video') }}</div>
  </div>
  <div v-else-if="tab === 3">
    <div class="flex justify-between pt-20">
      <!-- 審核通過會放入『# 已排入定時發佈』 $t('info.scheduledRelease')-->
      <!-- 審核失敗會放處 『# 審核失敗』 $t('info.auditFailure') -->
      <div class="text-base font-bold leading-md">#{{ $t('info.underReview') }}</div>
      <Tab v-model="tabBtn" :options="tabBtnOptions" isBtnTab :isBasicTab="false"></Tab>
    </div>
    <div v-if="tabBtn === 1">
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
    <div v-if="tabBtn === 2">{{ $t('info.video') }}</div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import Feed from '@comp/main/Feed.vue'
import Tab from '@comp/navigation/Tab.vue'

const tab = ref(1)
const tabOptions = ref([
  { label: 'common.subscribe', value: 1 },
  { label: 'label.sale', value: 2 },
  { label: 'label.scheduledRelease', value: 3 },
])

const tabBtn = ref(1)
const tabBtnOptions = ref([
  { label: 'info.img', value: 1 },
  { label: 'info.video', value: 2 },
])
const items = ref([])

const allPosts = ref(123)
</script>
