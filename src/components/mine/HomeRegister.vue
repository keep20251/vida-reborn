<template>
  <div>
    <SelfIntro :item="userData" show-all-info>
      <template #topButton>
        <div class="flex items-center space-x-10">
          <Icon class="cursor-pointer" name="link" size="20"></Icon>
          <Icon class="cursor-pointer" name="moreHorizontal" size="20"></Icon>
        </div>
      </template>
    </SelfIntro>

    <Tab v-model="tab" :options="tabOptions" class="mt-20 !h-35"></Tab>
    <div v-show="tab === TAB_TYPE.REC">
      <div class="overflow-x-hidden">
        <List :items="items" item-key="id">
          <template #default="{ item, last }">
            <Feed class="py-20" :item="item"></Feed>
            <div v-if="!last" class="h-1 bg-black opacity-[0.15]"></div>
          </template>
          <template #bottom>
            <div class="flex items-center justify-center py-8 text-gray-a3">
              <Loading v-if="isLoading"></Loading>
              <span v-if="noMore">{{ $t('common.noMore') }}</span>
            </div>
          </template>
        </List>
      </div>
    </div>
    <div v-show="tab === TAB_TYPE.SUB">
      <div class="flex justify-between pt-20">
        <div class="text-base font-bold leading-md">Popular Creator</div>
        <Icon name="filter" size="20" class="cursor-pointer"></Icon>
      </div>
      <div class="pt-10 text-base font-normal leading-md">订阅某个账号，以查看其最新帖子</div>
      <div class="flex flex-col justify-center space-y-10 pt-30">
        <ViewSubscribeCard
          v-for="index in 3"
          :key="`creator-card-${index}`"
          :theme="(index + 2) % 3"
        ></ViewSubscribeCard>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useAccountStore } from '@/store/account'
import List from '@comp/common/List.vue'
import Feed from '@comp/main/Feed.vue'
import SelfIntro from '@comp/main/SelfIntro.vue'
import Tab from '@comp/navigation/Tab.vue'
import { TAB_TYPE } from '@const/home'

const { t: $t } = useI18n()
const { userData } = storeToRefs(useAccountStore())

const tab = ref(TAB_TYPE.REC)
const tabOptions = ref([
  { label: 'tab.recommand', value: TAB_TYPE.REC },
  { label: 'tab.subscribe', value: TAB_TYPE.SUB },
])

const items = ref([])
</script>
