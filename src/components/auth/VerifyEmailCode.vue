<template>
  <div class="mb-[36rem] flex w-full flex-col justify-center px-32 pb-16 pt-32">
    <DialogHeader :title="$t('title.mailCodeLogin')" @back="back" @close="close">
      <template #default>
        <div class="flex flex-col space-y-32">
          <div class="flex flex-col space-y-30">
            <div class="px-[6.25rem] text-center text-sm font-normal leading-5">
              {{ $t('info.mailCodeSent', { mail: 'example@gmail.com' }) }}
            </div>
            <InputWrap
              v-model="verifyCode"
              :label="$t('label.mailCode')"
              :placeholder="$t('placeholder.mailCode')"
              :append-text-btn="$t('label.resend')"
              label-center
            ></InputWrap>
            <Button>{{ $t('label.login') }}</Button>
          </div>
          <div class="text-center">
            <button class="leading-md text-base font-normal" @click="to(AUTH_ROUTES.VERIFY_PASSWORD)">
              {{ $t('info.loginByPwd') }}
            </button>
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

const { to, back, close } = useAuthRouteStore()

const verifyCode = ref('')
</script>
