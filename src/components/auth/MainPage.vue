<template>
  <div>
    <div class="w-full text-center">
      <div class="relative mb-20 flex h-[2.99999625rem] w-full items-center justify-center">
        <div class="absolute top-30 text-[0.875rem] font-bold leading-[1.125rem]">提示</div>
        <div class="absolute right-20 top-20 cursor-pointer" @click="close">
          <Icon name="close"></Icon>
        </div>
      </div>
      <div class="mb-20 px-20">
        <span class="text-[0.75rem] font-normal leading-[0.75rem]">您是否要登入</span>
      </div>
      <div class="mb-30 flex justify-center gap-x-10">
        <button
          class="rounded-[1.125rem] bg-gray30 px-45 py-10 text-sm font-bold leading-[0.875rem] text-white"
          @click="close"
        >
          取消
        </button>
        <button
          class="rounded-[1.125rem] bg-primary px-45 py-10 text-sm font-bold leading-[0.875rem] text-white"
          @click="to(AUTH_ROUTES.SIGN_UP)"
        >
          確認
        </button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useAuthRouteStore } from '@/store/auth-route'
import { AUTH_ROUTES } from '@/constant'

const { to, close } = useAuthRouteStore()
</script>
