<template>
  <div class="leading-lg px-64 text-center text-base font-normal text-gray66">
    <div>{{ $t('content.welcomeToVida') }}</div>
    <div>{{ $t('content.verifyAccount') }}</div>
  </div>
</template>
<script setup>
import { useConfirmData } from '@/compositions/modal/confirm-data'
useConfirmData(() => true)
</script>
