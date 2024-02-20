<template>
  <div class="">
    <div class="flex flex-col items-center justify-center text-center">
      <div class="text-base font-normal leading-lg text-gray-57">
        {{ $t('modal.shopBuySuc.1') }}
      </div>
      <div class="text-base font-normal leading-lg text-gray-57">
        {{ $t('modal.shopBuySuc.2') }}
      </div>
    </div>
  </div>
</template>
<script setup>
import { useConfirmData } from '@use/modal/confirm-data'

useConfirmData(() => {
  return true
})
</script>
