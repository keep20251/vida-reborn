<template>
  <div class="flex w-full flex-col justify-center space-y-30 last:mb-30">
    <div class="relative mb-20 flex h-[2.99999625rem] w-full items-center justify-center">
      <div class="absolute right-20 top-20 cursor-pointer" @click="close">
        <Icon name="close"></Icon>
      </div>
    </div>
    <div class="flex flex-col justify-center space-y-10 px-20">
      <InputWrap
        v-model="email"
        :err-msg="error"
        :label="$t('label.email')"
        :placeholder="$t('placeholder.email')"
      ></InputWrap>
      <Button :loading="isLoading" @click="next">{{ $t('common.next') }}</Button>
    </div>
    <div class="text-center">{{ $t('info.loginOrRegister') }}</div>
    <div class="flex flex-col justify-center space-y-16 px-20">
      <button class="rounded-md border border-black py-8 text-center" @click="to(AUTH_ROUTES.LOGIN)">
        {{ $t('info.loginByAccount') }}
      </button>
      <button
        class="rounded-md border border-black py-8 text-center"
        @click="
          onAppleSignIn({
            onSuccess: onAppleLoginSuccess,
            onFailure: (e) => console.error(`Apple SignIn Failed`, e),
          })
        "
      >
        {{ $t('info.loginByApple') }}
      </button>
      <button class="rounded-md border border-black py-8 text-center" @click="googleLogin">
        {{ $t('info.loginByGoogle') }}
      </button>
      <button class="rounded-md border border-black py-8 text-center" @click="twitterLogin">
        {{ $t('info.loginByTwitter') }}
      </button>
    </div>
  </div>
</template>
<script setup>
import InputWrap from '@comp/form/InputWrap.vue'
import Button from '@comp/common/Button.vue'
import useRequest from '@/compositions/request'
import { useAuthRouteStore } from '@/store/auth-route'
import { AUTH_ROUTES } from '@/constant'
import { useThirdPartyAuth } from '@/compositions/request/third-party-auth'
import { ref } from 'vue'
import { useAccountStore } from '@/store/account'
import { storeToRefs } from 'pinia'
import { useEmailLoginStore } from '@/store/email-login'
import { useYup } from '@use/validator/yup.js'

const { twitterLogin, googleLogin, onAppleSignIn, redirect_uri } = useThirdPartyAuth()
const { to, close } = useAuthRouteStore()
const { setToken } = useAccountStore()

const { Yup, parseError } = useYup()
const schema = Yup.string().email().required()

const emailLoginStore = useEmailLoginStore()
const { sendEmailCode } = emailLoginStore
const { email } = storeToRefs(emailLoginStore)

const error = ref('')
const isLoading = ref(false)

async function next() {
  try {
    isLoading.value = true
    await schema.validate(email.value)
    const response = await sendEmailCode()
    console.log('sendEmailCode.response', response)
    to(AUTH_ROUTES.VERIFY_EMAIL_CODE)
  } catch (e) {
    error.value = parseError(e)
  } finally {
    isLoading.value = false
  }
}

/**
 * 蘋果登入成功後向後端請求取得 token
 * @param {Object} event
 */
async function onAppleLoginSuccess(event) {
  console.log('onAppleLoginSuccess', event)

  const { code } = event
  useRequest('ThirdParty.webLoginByApple', {
    params: {
      redirect_uri,
      apple_code: code,
    },
    onSuccess: (responseData) => {
      console.log('ThirdParty.webLoginByApple.response', responseData)
      setToken(responseData.token)
    },
    onError: (err) => {
      console.error(err)
    },
    immediate: true,
  })
}
</script>
