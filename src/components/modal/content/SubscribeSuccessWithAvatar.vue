<template>
  <div class="flex flex-col items-center justify-center text-center">
    <!-- 头像 -->
    <div class="mb-20">
      <img
        :src="content?.thumb || content?.avatar || '/default-avatar.png'"
        :alt="$t('modal.subscribeSuc.avatarAlt', { nickname: content?.nickname })"
        class="h-60 w-60 rounded-full object-cover"
      />
    </div>

    <!-- 主标题 -->
    <div class="mb-12 text-lg font-bold text-[#000000]">
      <span>{{ $t('modal.subscribeSuc.titlePrefix') }}</span>
      <span>{{ content?.nickname }}</span>
      <span>{{ $t('modal.subscribeSuc.titleSuffix') }}</span>
    </div>

    <!-- 详细描述 -->
    <div class="text-sm font-normal leading-5">
      <span class="text-gray-57">{{ $t('modal.subscribeSuc.descPrefix') }}</span>
      <span class="text-gray-57">{{ content?.nickname }}</span>
      <span class="font-medium text-[#6567E8]">{{ $t('modal.subscribeSuc.descHighlight1') }}</span>
      <span class="text-gray-57">{{ $t('modal.subscribeSuc.descMiddle') }}</span>
      <br />
      <span class="text-gray-57">{{ $t('modal.subscribeSuc.descBeforeHighlight2') }}</span>
      <span class="font-medium text-[#6567E8]">{{ $t('modal.subscribeSuc.descHighlight2') }}</span>
      <br />
      <span class="text-gray-57">{{ $t('modal.subscribeSuc.descSuffix') }}</span>
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
