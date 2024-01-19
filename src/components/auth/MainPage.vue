<template>
  <div class="relative flex w-full flex-col items-center justify-center space-y-30 px-50 py-[7.5rem] last:mb-30">
    <div class="absolute right-20 top-20 cursor-pointer" @click="close">
      <Icon name="close"></Icon>
    </div>
    <div class="flex items-center justify-center">
      <img class="h-[5rem] w-[9rem]" src="@/assets/logo.svg?url" alt="vida" />
    </div>
    <div class="text-lg font-bold leading-5">登入或註冊</div>
    <div class="flex w-full flex-col justify-center space-y-10 px-20">
      <InputWrap
        v-model="email"
        :err-msg="error"
        :label="$t('label.email')"
        :placeholder="$t('placeholder.email')"
        label-center
        @update:modelValue="() => (error = '')"
      ></InputWrap>
      <Button :loading="isLoading" @click="next">{{ $t('common.next') }}</Button>
    </div>
    <div class="text-center text-base font-normal leading-3">{{ $t('info.loginOrRegister') }}</div>
    <div class="flex w-full flex-col justify-center space-y-16 px-90">
      <button
        v-for="(option, index) in loginOptions"
        :key="`login-option-${index}`"
        class="rounded-full border border-black py-8 text-center"
        @click="option.onClick"
      >
        <div class="flex flex-row items-center justify-center">
          <Icon :name="option.icon" size="15" class="mr-10"></Icon>
          {{ $t(option.label) }}
        </div>
      </button>
    </div>
    <i18n-t
      keypath="content.termsDeclaration"
      tag="div"
      class="px-50 text-center text-sm font-normal leading-4 text-gray-600"
    >
      <template #tos>
        <span class="font-bold">{{ $t('content.tos') }}</span>
      </template>
      <template #pp>
        <span class="font-bold">{{ $t('content.pp') }}</span>
      </template>
    </i18n-t>
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
import { useMultiAuth } from '@/compositions/request/multi-auth'

const { twitterLogin, googleLogin, onAppleSignIn, redirect_uri } = useThirdPartyAuth()
const { to, close } = useAuthRouteStore()
const { setToken } = useAccountStore()

const { Yup, parseError } = useYup()
const schema = Yup.string().email().required()

const emailLoginStore = useEmailLoginStore()
const { email } = storeToRefs(emailLoginStore)
const { sendEmailCode } = useMultiAuth()

const error = ref('')
const isLoading = ref(false)

async function next() {
  try {
    isLoading.value = true
    await schema.validate(email.value)
    const response = await sendEmailCode({ email: email.value })
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
    onSuccess: async (responseData) => {
      console.log('ThirdParty.webLoginByApple.response', responseData)
      await setToken(responseData.token)
    },
    onError: (err) => {
      console.error(err)
    },
    immediate: true,
  })
}

const loginOptions = [
  { label: 'info.loginByAccount', icon: 'account', onClick: () => to(AUTH_ROUTES.LOGIN) },
  {
    label: 'info.loginByApple',
    icon: 'apple',
    onClick: () =>
      onAppleSignIn({
        onSuccess: onAppleLoginSuccess,
        onFailure: (e) => console.error(`Apple SignIn Failed`, e),
      }),
  },
  { label: 'info.loginByGoogle', icon: 'google', onClick: googleLogin },
  { label: 'info.loginByTwitter', icon: 'twitter', onClick: twitterLogin },
]
</script>
