<template>
  <div class="flex h-full w-full flex-col">
    <div class="relative rounded-t-xl bg-primary px-20 py-15 text-center text-white">
      <div class="text-lg font-bold leading-5">{{ $t('info.subscribeSetting') }}</div>
      <button @click="close" class="absolute right-0 top-1/3 pr-20">
        <Icon name="closeWhite"></Icon>
      </button>
    </div>
    <div class="select-none px-30 py-20">
      <div class="scrollbar-md max-h-[65vh] overflow-y-scroll pr-15">
        <div @click="subPlanAdd()" class="cursor-pointer text-center text-base font-bold leading-md text-gray-57">
          ＋ {{ $t('content.AddNewSubPlan') }}
        </div>
        <List :items="subList" item-key="id" divider>
          <template #default="{ item, index }">
            <div class="grid space-y-30 py-30">
              <div class="grid space-y-10">
                <div class="flex items-end justify-between">
                  <div class="flex flex-row items-end">
                    <div class="pr-4 text-xl font-bold leading-xl">${{ item.price }}</div>
                    <div class="text-base font-normal leading-lg">/{{ $t('content.month') }}</div>
                  </div>
                  <div class="text-base font-bold leading-md text-primary">{{ item.name }}</div>
                </div>
                <EncryptImage :src="item.picture" cover :borderRadius="10" :height="260"></EncryptImage>
                <div class="text-sm leading-md text-gray-57">{{ item.content }}</div>
                <Button class="mt-10" @click="subPlanEdit(subList, index)" gradient>{{ $t('label.edit') }}</Button>
              </div>
            </div>
          </template>
          <template #bottom>
            <div class="flex items-center justify-center text-gray-a3">
              <Loading v-if="isLoading">{{ $t('common.loading') }}</Loading>
              <span v-if="noMore">{{ $t('common.noMore') }}</span>
            </div>
          </template>
        </List>
      </div>
    </div>
  </div>
</template>
<script setup>
import { storeToRefs } from 'pinia'
import { useAccountStore } from '@/store/account'
import { useAppStore } from '@/store/app'
import { useSubPlanStore } from '@/store/sub-plan'
import Button from '@comp/common/Button.vue'
import List from '@comp/common/List.vue'
import { SUB_PLAN } from '@const'

const { appConfig } = useAppStore()
const { userData } = storeToRefs(useAccountStore())
const { to, close } = useSubPlanStore()
const {
  data,
  index: i,
  subList,
  lastIndex,
  addSubPlan,
  subPlanName,
  subPlanContent,
  subPlanPrice,
  subUnlockDayAfter,
  uploadFiles,
  selDefaultItem,
  selUploadItem,
} = storeToRefs(useSubPlanStore())

function subPlanAdd() {
  to(SUB_PLAN.SET)
  addSubPlan.value = true
  uploadFiles.value = []
  selDefaultItem.value = appConfig.subscription_images[0]
}

function subPlanEdit(d, index) {
  to(SUB_PLAN.SET)
  addSubPlan.value = false
  data.value = d
  i.value = index
  if (lastIndex.value !== null && lastIndex.value === index) {
    uploadFiles.value = [{ result: data.value[i.value].picture, progress: 1 }]
    selUploadItem.value = data.value[i.value]?.picture
    subPlanName.value = data.value[i.value].name
    subPlanContent.value = data.value[i.value].content
    subPlanPrice.value = data.value[i.value].price
    subUnlockDayAfter.value = data.value[i.value].unlock_day_after_subscribe
  }
  lastIndex.value = index
  selUploadItem.value = data.value[index.value]?.picture
}
</script>
