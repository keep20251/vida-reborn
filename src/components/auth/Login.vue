<template>
  <div class="flex w-full flex-col justify-center gap-y-30 px-32 pb-16 pt-32 last:mb-16">
    <DialogHeader title="Account登入" @back="back">
      <template #default>
        <div class="flex flex-col gap-y-32">
          <div class="flex flex-col gap-y-8">
            <InputWrap v-model="credential.username" title="用戶名" placeholder="輸入用戶名"></InputWrap>
            <InputWrap v-model="credential.password" title="密碼" placeholder="輸入密碼"></InputWrap>
            <Button>登入</Button>
          </div>
          <div class="text-center">
            <span>沒有註冊過嗎？<button class="underline" @click="to(AUTH_ROUTES.SIGN_UP)">點我進入註冊</button></span>
          </div>
        </div>
      </template>
    </DialogHeader>
  </div>
</template>
<script setup>
import { useAuthRouteStore } from '@/store/auth-route'
import DialogHeader from '@/components/dialog/DialogHeader.vue'
import InputWrap from '@/components/form/InputWrap.vue'
import Button from '@/components/common/Button.vue'
import { AUTH_ROUTES } from '@/constant'
import { reactive } from 'vue'

const { to, back } = useAuthRouteStore()

const credential = reactive({
  username: '',
  password: '',
})
</script>
