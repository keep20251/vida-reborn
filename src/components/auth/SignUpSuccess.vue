<template>
  <div class="flex w-full flex-col justify-center gap-y-30 px-32 pb-16 pt-32 last:mb-16">
    <div class="text-center">{{ $t('info.registerSuccess') }}</div>
    <div class="px-64 text-center">
      <div>{{ $t('content.welcomeToVida') }}</div>
      <div>{{ $t('content.verifyAccount') }}</div>
    </div>
    <div class="flex gap-x-16 px-48">
      <Button @click="`${(close(), router.push('/'))}`">{{ $t('common.getAround') }}</Button>
      <Button @click="`${(close(), router.push('/'))}`">{{ $t('common.goNow') }}</Button>
    </div>
  </div>
</template>
<script setup>
import Button from '@/components/common/Button.vue'
import { useAuthRouteStore } from '@/store/auth-route'
import { useRouter } from 'vue-router'

const { close } = useAuthRouteStore()
const router = useRouter()
</script>
