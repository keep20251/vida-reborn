<template>
  <div class="flex w-full flex-col justify-center space-y-30 px-32 pb-16 pt-32 last:mb-16">
    <div class="text-center">{{ $t('info.registerSuccess') }}</div>
    <div class="px-64 text-center">
      <div>{{ $t('content.welcomeToVida') }}</div>
      <div>{{ $t('content.verifyAccount') }}</div>
    </div>
    <div class="16 flex px-48">
      <Button @click="`${(close(), to('home'))}`">{{ $t('common.getAround') }}</Button>
      <Button @click="`${(close(), to('mine-account'))}`">{{ $t('common.goNow') }}</Button>
    </div>
  </div>
</template>
<script setup>
import { useAuthRouteStore } from '@/store/auth-route'
import Button from '@comp/common/Button.vue'
import { useRouters } from '@use/routers'

const { close } = useAuthRouteStore()
const { to } = useRouters()
</script>
