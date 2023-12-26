<template>
  <div class="flex w-full flex-col justify-center gap-y-30 px-32 pb-16 pt-32 last:mb-16">
    <DialogHeader :title="$t('title.accountLogin')" @back="back">
      <template #default>
        <div class="flex flex-col gap-y-32">
          <div class="flex flex-col gap-y-8">
            <InputWrap
              v-model="credential.account"
              :label="$t('label.account')"
              :placeholder="$t('placeholder.account')"
            ></InputWrap>
            <InputWrap
              v-model="credential.password"
              :label="$t('label.password')"
              :placeholder="$t('placeholder.password')"
            ></InputWrap>
            <Button>{{ $t('label.login') }}</Button>
          </div>
          <div class="text-center">
            <span>
              {{ $t('info.neverRegister') }}
              <button class="underline" @click="to(AUTH_ROUTES.SIGN_UP)">
                {{ $t('info.clickToRegister') }}
              </button>
            </span>
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
  account: '',
  password: '',
})
</script>
