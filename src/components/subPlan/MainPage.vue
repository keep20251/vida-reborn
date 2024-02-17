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
        <List :items="dataList" item-key="id" divider>
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
                <Button class="mt-10" @click="subPlanEdit(dataList, index)" gradient>{{ $t('label.edit') }}</Button>
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
import { onActivated, onDeactivated, onMounted, onUnmounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useMineStore } from '@/store/mine'
import { useSubPlanStore } from '@/store/sub-plan'
import Button from '@comp/common/Button.vue'
import List from '@comp/common/List.vue'
import { useInfinite } from '@use/request/infinite'
import { SUB_PLAN } from '@const'

const { dataList, isLoading, noMore, init, next } = useInfinite('Subscription.list', {
  params: {},
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

const { to, close } = useSubPlanStore()
const {
  data,
  index: i,
  addSubPlan,
  subPlanName,
  subPlanContent,
  subPlanPrice,
  subPicture,
  subUnlockDayAfter,
  uploadFiles,
} = storeToRefs(useSubPlanStore())

function subPlanAdd() {
  to(SUB_PLAN.SET)
  addSubPlan.value = true
  subPlanName.value = ''
  subPlanContent.value = ''
  subPlanPrice.value = ''
  subPicture.value = ''
  subUnlockDayAfter.value = ''
}

const lastIndex = ref(null)
function subPlanEdit(dataList, index) {
  to(SUB_PLAN.SET)
  addSubPlan.value = false
  data.value = dataList
  i.value = index
  if (lastIndex.value !== null && lastIndex.value === index) {
    uploadFiles.value.push({ result: data.value[i.value].picture, progress: 1 })
  }
  lastIndex.value = index
}
</script>
