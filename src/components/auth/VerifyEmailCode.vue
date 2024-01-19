<template>
  <div class="flex w-full flex-col justify-center pb-16 pt-32">
    <DialogHeader :title="$t('title.mailCodeLogin')" @back="back" @close="close">
      <template #default>
        <div class="flex flex-col space-y-32">
          <div class="flex flex-col space-y-30">
            <div class="px-[6.25rem] text-center text-sm font-normal leading-5">
              {{ $t('info.mailCodeSent', { mail: email }) }}
            </div>
            <InputWrap
              v-model="verifyCode"
              :label="$t('label.mailCode')"
              :placeholder="$t('placeholder.mailCode')"
              :append-text-btn="appendTextBtn"
              :append-text="appendText"
              :err-msg="verifyCodeError"
              label-center
              @click:append="onResendClick"
              @update:modelValue="verifyCodeError = ''"
            ></InputWrap>
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
import InputWrap from '@/components/form/InputWrap.vue'
import Button from '@/components/common/Button.vue'
import useRequest from '@use/request/index.js'
import { useAuthRouteStore } from '@/store/auth-route'
import { AUTH_ROUTES } from '@/constant'
import { useEmailLoginStore } from '@/store/email-login'
import { storeToRefs } from 'pinia'
import { useYup } from '@use/validator/yup'
import { computed, ref } from 'vue'
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
    emailLoginStore.reset()
  } catch (e) {
    serverError.value = e.message
    console.error(e)
  }
}

const sent = ref(false)
const tick = ref(60)

function onResendClick() {
  sendEmailCode({ email: email.value })
  sent.value = true
  const countdown = setInterval(() => {
    if (tick.value === 0) {
      clearInterval(countdown)
      sent.value = false
      tick.value = 60
    } else {
      tick.value--
    }
  }, 1000)
}

const appendTextBtn = computed(() => (sent.value ? '' : $t('label.resend')))
const appendText = computed(() => `${tick.value}s`)
</script>
