<template>
  <div class="flex w-full flex-col justify-center space-y-30 pb-16 pt-32 last:mb-16">
    <DialogHeader :title="$t('title.accountLogin')" @back="back">
      <template #default>
        <div class="flex flex-col space-y-32">
          <div class="flex flex-col space-y-8">
            <InputWrap
              v-model="credential.account.value"
              :label="$t('label.account')"
              :placeholder="$t('placeholder.account')"
              :err-msg="credential.account.error"
            ></InputWrap>
            <InputWrap
              v-model="credential.password.value"
              :label="$t('label.password')"
              :placeholder="$t('placeholder.password')"
              password
              :err-msg="credential.password.error"
            ></InputWrap>
            <Button :loading="isLoading" @click="validaite">{{ $t('label.login') }}</Button>
          </div>
          <div class="text-center text-base leading-md text-gray66">
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
import { reactive, ref } from 'vue'
import { useAccountStore } from '@/store/account'
import { useAuthRouteStore } from '@/store/auth-route'
import Button from '@comp/common/Button.vue'
import DialogHeader from '@comp/dialog/DialogHeader.vue'
import InputWrap from '@comp/form/InputWrap.vue'
import useRequest from '@use/request/index.js'
import { useYup } from '@use/validator/yup.js'
import { AUTH_ROUTES } from '@const'

const { to, back } = useAuthRouteStore()

const { Yup, validate } = useYup()
const { string } = Yup

const credential = reactive({
  account: {
    value: '',
    error: '',
    check: false,
    schema: string().required(),
  },
  password: {
    value: '',
    error: '',
    check: false,
    schema: string().required(),
  },
})

const isLoading = ref(false)

async function validaite() {
  try {
    isLoading.value = true
    await Promise.all([
      validate(credential.account.schema, credential.account),
      validate(credential.password.schema, credential.password),
    ])

    if (Object.values(credential).some((item) => item.check === false)) return
    login()
  } catch (e) {
    console.error(e)
    isLoading.value = false
  }
}

const accountStore = useAccountStore()
const { login: loginAccount } = accountStore

async function login() {
  const { data, execute } = useRequest('Account.loginByPassword')
  try {
    await execute({
      account: credential.account.value,
      password: credential.password.value,
    })
    await loginAccount(data.value.token)
  } catch (e) {
    console.error(e)
  } finally {
    isLoading.value = false
  }
}
</script>
