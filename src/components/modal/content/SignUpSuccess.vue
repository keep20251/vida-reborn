<template>
  <div class="px-64 text-center text-base font-normal leading-lg text-gray66">
    <div>{{ $t('content.welcomeToVida') }}</div>
    <div>{{ $t('content.verifyAccount') }}</div>
  </div>
</template>
<script setup>
import { useConfirmData } from '@use/modal/confirm-data'

useConfirmData(() => true)
</script>
