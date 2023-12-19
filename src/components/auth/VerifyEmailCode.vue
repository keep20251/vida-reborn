<template>
  <div class="flex w-full flex-col justify-center gap-y-30 px-32 pb-16 pt-32 last:mb-16">
    <DialogHeader title="驗證碼登入" @back="back">
      <template #default>
        <div class="flex flex-col gap-y-32">
          <div class="flex flex-col gap-y-8">
            <div class="px-32 text-center">郵件驗證碼已發送，請輸入剛傳送至example@gmail.com的驗證碼來登入</div>
            <InputWrap
              v-model="verifyCode"
              title="郵箱驗證碼"
              placeholder="輸入驗證碼"
              append-text-btn="重新發送"
            ></InputWrap>
            <Button>登入</Button>
          </div>
          <div class="text-center">
            <button @click="to(AUTH_ROUTES.VERIFY_PASSWORD)">使用密碼方式登入</button>
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
import { ref } from 'vue'

const { to, back } = useAuthRouteStore()

const verifyCode = ref('')
</script>
