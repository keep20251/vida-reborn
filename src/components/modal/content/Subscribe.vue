<template>
  <div class="flex h-full w-full flex-col items-center justify-center space-y-30">
    <div class="flex flex-col items-center justify-center space-y-6">
      <div class="text-base font-normal leading-lg">
        <span class="text-xl font-bold leading-xl"> ${{ removeDecimalIfHundred(content?.price) }} </span>
        / {{ $t('unit.day', { days: content?.expire_days }) }}
      </div>
      <div class="text-base font-bold leading-md text-subscribe-orange">{{ content?.name }}</div>
    </div>
    <div class="flex flex-col space-y-10">
      <div v-for="(doc, index) in documents" :key="`docuemnt-${index}`" class="flex flex-row items-center space-x-15">
        <Icon name="checkPrimary" size="20" class="flex items-center"></Icon>
        <div>{{ doc.value }}</div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useModalStore } from '@/store/modal'
import { useConfirmData } from '@use/modal/confirm-data'

const { content } = storeToRefs(useModalStore())

const { t: $t } = useI18n()
const documents = [
  computed(() => {
    // 如果解鎖天數是99999，顯示"全部內容"，否則顯示具體天數
    if (content.value?.unlock_day_after_subscribe >= 99999) {
      return $t('modal.subscribe.allContent')
    }
    return $t('modal.subscribe.1', { days: content.value?.unlock_day_after_subscribe })
  }),
  computed(() => $t('modal.subscribe.2')),
  computed(() => $t('modal.subscribe.3')),
  computed(() => $t('modal.subscribe.4')),
]

useConfirmData(() => true)

function removeDecimalIfHundred(value) {
  const num = Number(value) // 因為後端拿回來是字串

  // 判斷是否是百位數以上的整數
  if (!isNaN(num) && Number.isInteger(num) && num >= 100) {
    return Math.trunc(num) // 去掉小數點
  } else {
    return num
  }
}
</script>
