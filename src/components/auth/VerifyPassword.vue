<template>
  <div class="flex w-full flex-col justify-center space-y-30 px-32 pb-16 pt-32 last:mb-16">
    <DialogHeader :title="$t('title.pwdLogin')" @back="back">
      <template #default>
        <div class="flex flex-col space-y-32">
          <div class="flex flex-col space-y-8">
            <InputWrap
              v-model="password"
              :label="$t('label.password')"
              :placeholder="$t('placeholder.password')"
            ></InputWrap>
            <Button>{{ $t('label.login') }}</Button>
          </div>
          <div class="text-center">
            <button @click="to(AUTH_ROUTES.LOGIN)">{{ $t('info.loginByAccount') }}</button>
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
const password = ref('')
</script>
