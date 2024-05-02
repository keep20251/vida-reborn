<template>
  <div class="flex h-full w-full flex-col justify-center space-y-30">
    <DialogHeader :title="$t('title.accountLogin')" @back="back" @close="close">
      <template #default>
        <div class="flex flex-col space-y-32">
          <div class="flex flex-col space-y-8">
            <InputWrap
              v-model="credential.account.value"
              :label="$t('label.account')"
              :placeholder="$t('placeholder.account')"
              :err-msg="credential.account.error"
              @keypress:enter="submit"
            ></InputWrap>
            <InputWrap
              v-model="credential.password.value"
              :label="$t('label.password')"
              :placeholder="$t('placeholder.password')"
              password
              :err-msg="credential.password.error"
              @keypress:enter="submit"
            ></InputWrap>
            <Button :loading="isLoading" @click="submit">{{ $t('label.login') }}</Button>
            <div v-if="serverErrorMsg" class="text-base text-warning">{{ serverErrorMsg }}</div>
          </div>
          <div class="text-center text-base leading-md text-gray-57">
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

const { to, back, close } = useAuthRouteStore()

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

async function submit() {
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

const serverErrorMsg = ref('')

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
    serverErrorMsg.value = e.message
  } finally {
    isLoading.value = false
  }
}
</script>
