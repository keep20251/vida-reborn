<template>
  <Tab v-model="tab" :options="tabOptions" class="!h-35"></Tab>
  <div v-if="tab === 1">
    <div class="flex justify-between pt-20">
      <div class="text-base font-bold leading-md">{{ $t('content.allPosts') }}{{ allPosts }}</div>
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
    <div v-if="tabBtn === 2">{{ $t('info.video') }}</div>
  </div>
  <div v-else-if="tab === 2">
    <div class="flex justify-between pt-20">
      <div class="text-base font-bold leading-md">{{ $t('content.allPosts') }}{{ allPosts }}</div>
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
    <div v-if="tabBtn === 2">{{}}</div>
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
    <div v-if="tabBtn === 2">{{}}</div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import Tab from '@comp/navigation/Tab.vue'
import List from '@comp/common/List.vue'
import Feed from '@comp/main/Feed.vue'
import Loading from '@comp/common/Loading.vue'
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()

const tab = ref(1)
const tabOptions = ref([
  { label: $t('common.subscribe'), value: 1 },
  { label: $t('label.sale'), value: 2 },
  { label: $t('label.scheduledRelease'), value: 3 },
])

const tabBtn = ref(1)
const tabBtnOptions = ref([
  { label: $t('info.img'), value: 1 },
  { label: $t('info.video'), value: 2 },
])
const items = ref([{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }])

const allPosts = ref(123)
</script>
