<template>
  <div class="flex w-full flex-col space-y-20 px-14 py-30">
    <div class="flex flex-col space-y-5">
      <div class="text-base font-normal leading-3">{{ $t('info.socialLink') }}</div>
      <div class="flex flex-col space-y-10">
        <InputWrap prepend-icon="socialInstagram"></InputWrap>
        <InputWrap prepend-icon="socialFacebook"></InputWrap>
        <InputWrap prepend-icon="socialYoutube"></InputWrap>
        <InputWrap prepend-icon="socialTwitter"></InputWrap>
        <InputWrap prepend-icon="socialTiktok"></InputWrap>
      </div>
    </div>
    <div class="flex flex-col space-y-10">
      <div class="text-base font-normal leading-3">{{ $t('info.forExample') }}:https://www.instagram.com/username</div>
      <div class="text-base font-normal leading-3">
        {{ $t('info.accept') }}:Instagram \ Facebook \ Youtube \ Twitter \ Tiktok
      </div>
    </div>
  </div>
</template>
<script setup>
import InputWrap from '@/components/form/InputWrap.vue'
import { useConfirmData } from '@/compositions/modal/confirm-data'

useConfirmData(() => {
  console.log('useConfirmData')
  return true
})
</script>
