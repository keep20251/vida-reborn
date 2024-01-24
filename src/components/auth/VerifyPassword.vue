<template>
  <div class="flex w-full flex-col justify-center space-y-30 pt-32 last:mb-16">
    <DialogHeader :title="$t('title.pwdLogin')" @back="back" @close="close">
      <template #default>
        <div class="flex flex-col space-y-32">
          <div class="flex flex-col space-y-8">
            <InputWrap
              v-model="password"
              :label="$t('label.password')"
              :placeholder="$t('placeholder.password')"
              password
            ></InputWrap>
            <Button @click="validate">{{ $t('label.login') }}</Button>
          </div>
          <div class="text-center text-base font-normal leading-md">
            <button @click="to(AUTH_ROUTES.LOGIN)">{{ $t('info.loginByAccount') }}</button>
          </div>
        </div>
      </template>
    </DialogHeader>
  </div>
</template>
<script setup>
import DialogHeader from '@comp/dialog/DialogHeader.vue'
import InputWrap from '@comp/form/InputWrap.vue'
import Button from '@comp/common/Button.vue'
import { useAuthRouteStore } from '@/store/auth-route'
import { AUTH_ROUTES } from '@const'
import { useEmailLoginStore } from '@/store/email-login'
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useYup } from '@use/validator/yup'
import { useAccountStore } from '@/store/account'
import useRequest from '@use/request/index.js'

const { to, back, close } = useAuthRouteStore()

const emailLoginStore = useEmailLoginStore()
const { email, password } = storeToRefs(emailLoginStore)

const { Yup, parseError } = useYup()
const pwdSchema = Yup.string().required()
const passwordError = ref('')
const serverError = ref('')

async function validate() {
  try {
    await pwdSchema.validate(password.value)
    await loginByPassword()
  } catch (e) {
    passwordError.value = parseError(e)
    console.error(e)
  }
}

const accountStore = useAccountStore()
const { login } = accountStore

async function loginByPassword() {
  const { data, execute } = useRequest('Account.loginByPassword')
  try {
    await execute({
      account: email.value,
      password: password.value,
    })
    await login(data.value.token)
    emailLoginStore.$reset()
  } catch (e) {
    serverError.value = e.message
    console.error(e)
  }
}
</script>
