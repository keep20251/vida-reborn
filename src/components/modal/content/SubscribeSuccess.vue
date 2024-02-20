<template>
  <div class="">
    <div class="flex flex-col items-center justify-center text-center">
      <div class="text-base font-normal leading-lg text-gray-57">
        {{ $t('modal.subscribeSuc.1', { nickname: content?.nickname }) }}
      </div>
      <div class="px-75 text-base font-normal leading-lg text-gray-57">
        {{ $t('modal.subscribeSuc.2') }}
      </div>
    </div>
  </div>
</template>
<script setup>
import { storeToRefs } from 'pinia'
import { useModalStore } from '@/store/modal'
import { useConfirmData } from '@use/modal/confirm-data'

const { content } = storeToRefs(useModalStore())

useConfirmData(() => {
  return true
})
</script>
