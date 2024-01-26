<template>
  <div class="text-gray-57 px-64 text-center text-base font-normal leading-lg">
    <div>{{ $t('content.welcomeToVida') }}</div>
    <div>{{ $t('content.verifyAccount') }}</div>
  </div>
</template>
<script setup>
import { useConfirmData } from '@use/modal/confirm-data'

useConfirmData(() => true)
</script>
