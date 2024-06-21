<template>
  <div class="flex h-full w-full flex-col">
    <div class="relative rounded-t-xl bg-primary px-20 py-15 text-center text-white">
      <div class="text-lg font-bold leading-5">{{ $t('info.subscribeSetting') }}</div>
      <button @click="close" class="absolute right-0 top-1/3 pr-20">
        <Icon name="closeWhite"></Icon>
      </button>
    </div>
    <div class="select-none p-30 pr-10">
      <div
        class="max-h-[65vh] overflow-y-scroll pr-10"
        :class="{ 'my-10': subList.length === 0, 'hover-scrollbar': isDesktop, 'pr-20': !isDesktop }"
      >
        <div @click="subPlanAdd" class="cursor-pointer text-center text-base font-bold leading-md text-gray-57">
          ＋ {{ $t('content.AddNewSubPlan') }}
          <label
            v-if="subList.length === 0"
            class="mt-15 flex cursor-pointer flex-col items-center justify-center space-y-10 bg-gray-f6 py-72"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="62" height="55" viewBox="0 0 62 55" fill="none">
              <path
                d="M23.2808 10.5731C22.0864 10.5731 21.118 11.5453 21.118 12.7441V14.8621C21.118 16.0611 22.0865 17.0331 23.2808 17.0331C24.4751 17.0331 25.4435 16.061 25.4435 14.8621V12.7441C25.4435 11.5451 24.4751 10.5731 23.2808 10.5731Z"
                fill="#ECECEC"
              />
              <path
                d="M38.7192 17.0331C39.9137 17.0331 40.8821 16.061 40.8821 14.8621V12.7441C40.8821 11.5451 39.9136 10.5731 38.7192 10.5731C37.5249 10.5731 36.5565 11.5453 36.5565 12.7441V14.8621C36.5564 16.061 37.5249 17.0331 38.7192 17.0331Z"
                fill="#ECECEC"
              />
              <path
                d="M25.8843 18.9147C24.8695 19.5475 24.5579 20.8862 25.1884 21.9045C25.9646 23.159 28.0951 25.282 31.1544 25.282C34.1983 25.282 36.3547 23.175 37.1493 21.93C37.7934 20.9201 37.5002 19.5774 36.4945 18.9307C35.4878 18.2844 34.1504 18.5784 33.5066 19.5879C33.4981 19.6018 32.5801 20.9399 31.1544 20.9399C29.7689 20.9399 28.9078 19.6798 28.85 19.5933C28.2153 18.5907 26.8918 18.2861 25.8843 18.9147Z"
                fill="#ECECEC"
              />
              <path
                d="M52.6279 0L35.1146 0C33.9201 0 32.9518 0.972129 32.9518 2.17102C32.9518 3.36991 33.9202 4.34204 35.1146 4.34204L52.6279 4.34204C55.4102 4.34204 57.6744 6.61449 57.6744 9.40782V37.0008L44.5639 25.5112C43.719 24.7705 42.4507 24.8017 41.6435 25.5805L27.9813 38.7496L16.9673 27.8615C16.1436 27.048 14.8274 27.0272 13.9791 27.8166L4.32561 36.8035L4.32561 9.40789C4.32561 6.61456 6.58942 4.34211 9.37214 4.34211L26.8854 4.34211C28.0799 4.34211 29.0482 3.36998 29.0482 2.17109C29.0482 0.9722 28.0798 0 26.8854 0L9.37214 0C4.20415 0 0 4.22019 0 9.40789L0 45.5921C0 50.7798 4.20415 55 9.37214 55H26.8854C28.0799 55 29.0482 54.0279 29.0482 52.829C29.0482 51.6301 28.0798 50.658 26.8854 50.658H9.37214C6.58942 50.658 4.32561 48.3855 4.32561 45.5922V42.7257L15.4051 32.4114L26.4448 43.325C27.2791 44.1497 28.6164 44.1579 29.4602 43.3441L43.2107 30.0895L57.6745 42.7643V45.5922C57.6745 48.3855 55.4103 50.658 52.6279 50.658H35.1146C33.9201 50.658 32.9518 51.6301 32.9518 52.829C32.9518 54.0279 33.9202 55 35.1146 55H52.6279C57.7955 55 62 50.7798 62 45.5921V9.40789C62 4.22019 57.7955 0 52.6279 0Z"
                fill="#ECECEC"
              />
            </svg>
            <span class="text-base leading-lg text-gray-a3">{{ $t('content.AddFirstSubPlan') }}</span>
          </label>
        </div>
        <List :items="subList" item-key="id" divider>
          <template #default="{ item, index }">
            <SubscribeCard
              @move:up="toUp(subList, index)"
              @move:down="toDown(subList, index)"
              @edit="subPlanEdit(subList, index)"
              @delete="onDelete(subList, index)"
              :item="item"
              subscript-btn
              edit-mode
              :height="260"
              class="mb-20 mt-30"
            ></SubscribeCard>
          </template>
        </List>
      </div>
    </div>
  </div>
</template>
<script setup>
import debounce from 'lodash/debounce'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/store/app'
import { useModalStore } from '@/store/modal'
import { usePopupMessageStore } from '@/store/popup-message'
import { useSubPlanStore } from '@/store/sub-plan'
import List from '@comp/common/List.vue'
import useRequest from '@use/request'
import { SUB_PLAN } from '@const'
import SubscribeCard from '@/components/card/SubscribeCard.vue'

const { t: $t } = useI18n()
const { open: openMessage } = usePopupMessageStore()
const { confirm } = useModalStore()
const { appConfig } = useAppStore()
const { isDesktop } = storeToRefs(useAppStore())
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
    subPlanName.value = data.value[i.value].name
    subPlanContent.value = data.value[i.value].content
    subPlanPrice.value = data.value[i.value].price
    subUnlockDayAfter.value = data.value[i.value].unlock_day_after_subscribe
  }
  lastIndex.value = index
}

const toUp = debounce((subList, index) => {
  if (index > 0) {
    const temp = subList[index]
    const toUpId = subList[index].id
    subList.splice(index, 1)
    subList.splice(index - 1, 0, temp)
    updateSort(toUpId, 'up')
    openMessage('common.editSubscription.moveUp')
  } else {
    openMessage('info.firstItem')
  }
})

const toDown = debounce((subList, index) => {
  if (index < subList.length - 1) {
    const temp = subList[index]
    const toDownId = subList[index].id
    subList.splice(index, 1)
    subList.splice(index + 1, 0, temp)
    updateSort(toDownId, 'down')
    console.log(subList)

    openMessage('common.editSubscription.moveDown')
  } else {
    openMessage('info.lastItem')
  }
})

const updateSort = async (id, direction) => {
  const { execute: changeSort } = useRequest('Subscription.updateSort')
  try {
    const data = { id, sort: direction }
    console.log('data:', data)
    await changeSort({ id, sort: direction })
  } catch (e) {
    console.error(e)
  }
}

const onDelete = (subList, index) => {
  confirm({
    size: 'sm',
    title: 'beCreator.title.reConfirm',
    content: $t('content.delSubPlan'),
    confirmAction: () => delSubPlan(subList, index),
  })
}
const delSubPlan = async (subList, index) => {
  const { execute: subPlanDel } = useRequest('Subscription.bulkDel')
  try {
    await subPlanDel({ ids: subList[index].id })
    subList.splice(index, 1)
    openMessage('title.delSuccess')
  } catch (e) {
    console.error(e)
  }
}
</script>
