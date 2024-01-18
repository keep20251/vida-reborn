<template>
  <div class="flex w-full flex-col justify-center gap-y-30 px-32 pb-16 pt-32 last:mb-16">
    <DialogHeader :title="$t('title.mailCodeLogin')" @back="back">
      <template #default>
        <div class="flex flex-col gap-y-32">
          <div class="flex flex-col gap-y-8">
            <div class="px-32 text-center">{{ $t('info.mailCodeSent', { mail: 'example@gmail.com' }) }}</div>
            <InputWrap
              v-model="verifyCode"
              :label="$t('label.mailCode')"
              :placeholder="$t('placeholder.mailCode')"
              :append-text-btn="$t('label.resend')"
            ></InputWrap>
            <Button>{{ $t('label.login') }}</Button>
          </div>
          <div class="text-center">
            <button @click="to(AUTH_ROUTES.VERIFY_PASSWORD)">{{ $t('info.loginByPwd') }}</button>
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
