<template>
  <div class="flex w-full flex-col justify-center pb-16 pt-32">
    <DialogHeader :title="$t('title.mailCodeLogin')" @back="back" @close="close">
      <template #default>
        <div class="flex flex-col space-y-32">
          <div class="flex flex-col space-y-30">
            <div class="px-[6.25rem] text-center text-sm font-normal leading-5">
              {{ $t('info.mailCodeSent', { mail: email }) }}
            </div>
            <InputEmailCode
              v-model="verifyCode"
              :onResend="() => sendEmailCode({ email })"
              :err-msg="verifyCodeError"
              :first-time="false"
              :label-center="true"
              @update:modelValue="verifyCodeError = ''"
              @error="(message) => (serverError = message)"
            ></InputEmailCode>
            <Button :loading="isLoading" @click="validate">{{ $t('label.login') }}</Button>
            <div v-if="!!serverError" class="text-base font-normal leading-md text-warning">{{ serverError }}</div>
          </div>
          <div class="text-center">
            <button class="text-base font-normal leading-md" @click="to(AUTH_ROUTES.VERIFY_PASSWORD)">
              {{ $t('info.loginByPwd') }}
            </button>
          </div>
        </div>
      </template>
    </DialogHeader>
  </div>
</template>
<script setup>
import DialogHeader from '@/components/dialog/DialogHeader.vue'
import InputEmailCode from '@/components/form/InputEmailCode.vue'
import Button from '@/components/common/Button.vue'
import useRequest from '@use/request/index.js'
import { useAuthRouteStore } from '@/store/auth-route'
import { AUTH_ROUTES } from '@/constant'
import { useEmailLoginStore } from '@/store/email-login'
import { storeToRefs } from 'pinia'
import { useYup } from '@use/validator/yup'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAccountStore } from '@/store/account'
import { useMultiAuth } from '@/compositions/request/multi-auth'

const { t: $t } = useI18n()
const { to, back, close } = useAuthRouteStore()

const emailLoginStore = useEmailLoginStore()
const { email, verifyCode } = storeToRefs(emailLoginStore)
const { sendEmailCode } = useMultiAuth()

const { Yup, parseError } = useYup()
const schema = Yup.string().required().min(6).max(6)

const verifyCodeError = ref('')
const isLoading = ref(false)

async function validate() {
  try {
    isLoading.value = true
    await schema.validate(verifyCode.value)
    await loginByEmailCode()
  } catch (e) {
    verifyCodeError.value = parseError(e)
  } finally {
    isLoading.value = false
  }
}

const serverError = ref('')
const accountStore = useAccountStore()
const { setToken } = accountStore

async function loginByEmailCode() {
  const { data, execute } = useRequest('Account.loginByEmail', {})
  try {
    await execute({
      email: email.value,
      code: verifyCode.value,
    })
    await setToken(data.value.token)
    emailLoginStore.$reset()
  } catch (e) {
    serverError.value = e.message
    console.error(e)
  }
}
</script>
