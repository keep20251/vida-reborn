<template>
  <div class="flex h-full w-full">
    <div class="relative max-h-[70vh] overflow-y-auto md:overflow-y-hidden">
      <div class="absolute right-0 top-0 cursor-pointer" @click="close">
        <Icon name="close"></Icon>
      </div>
      <div class="flex flex-col items-center justify-center space-y-30">
        <div class="flex h-[5rem] w-[9rem] items-center justify-center">
          <img class="h-full w-full" src="@/assets/logo.svg?url" alt="VIDA" />
        </div>
        <div class="text-lg font-bold leading-5">{{ $t('info.loginOr') }}{{ $t('info.quickRegister') }}</div>
        <div class="flex w-full flex-col justify-center space-y-10 px-20">
          <InputWrap
            v-model="credential.email.value"
            :err-msg="credential.email.error"
            :label="$t('label.email')"
            :placeholder="$t('placeholder.email')"
            label-center
            focus
            @update:modelValue="() => (credential.email.error = '')"
            @keypress:enter="next"
          ></InputWrap>
          <Button :loading="isLoading" @click="next">{{ $t('common.next') }}</Button>
        </div>
        <div class="text-center text-base font-normal leading-3">
          {{ $t('info.loginOr')
          }}<span class="cursor-pointer text-primary" @click="to(AUTH_ROUTES.SIGN_UP)">{{
            $t('info.quickRegister')
          }}</span>
        </div>
        <div class="flex w-full flex-col justify-center space-y-16 px-45 md:px-60 lg:px-90">
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
            <span class="cursor-pointer font-bold" @click="openTermsOfService">{{ $t('content.tos') }}</span>
          </template>
          <template #pp>
            <span class="cursor-pointer font-bold" @click="openPrivacyPolicy">{{ $t('content.pp') }}</span>
          </template>
        </i18n-t>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useAccountStore } from '@/store/account'
import { useAuthRouteStore } from '@/store/auth-route'
import { useEmailLoginStore } from '@/store/email-login'
import { useModalStore } from '@/store/modal'
import Button from '@comp/common/Button.vue'
import InputWrap from '@comp/form/InputWrap.vue'
import useRequest from '@use/request'
import { useMultiAuth } from '@use/request/multi-auth'
import { useThirdPartyAuth } from '@use/request/third-party-auth'
import { useYup } from '@use/validator/yup.js'
import { AUTH_ROUTES, MODAL_TYPE } from '@const'

const { twitterLogin, googleLogin, onAppleSignIn, redirect_uri } = useThirdPartyAuth()
const { to, close } = useAuthRouteStore()
const { login } = useAccountStore()

const { Yup, parseError } = useYup()
const schema = Yup.string().email().required()

const emailLoginStore = useEmailLoginStore()
const { credential, checkEmailExist } = storeToRefs(emailLoginStore)
const { sendEmailCode } = useMultiAuth()

const isLoading = ref(false)

async function next() {
  try {
    isLoading.value = true
    await schema.validate(credential.value.email.value)
    const isEmailExist = await useRequest('Account.isUsedEmail', {
      params: { email: credential.value.email.value },
      immediate: true,
    })
    checkEmailExist.value = true

    if (isEmailExist) {
      await sendEmailCode({ email: credential.value.email.value })
      to(AUTH_ROUTES.VERIFY_EMAIL_CODE)
    } else {
      to(AUTH_ROUTES.SIGN_UP)
    }
  } catch (e) {
    credential.value.email.error = parseError(e)
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
  try {
    const responseData = await useRequest('ThirdParty.webLoginByApple', {
      params: {
        redirect_uri,
        apple_code: code,
      },
      immediate: true,
    })
    console.log('ThirdParty.webLoginByApple.response', responseData)
    await login(responseData.token)
  } catch (err) {
    console.error(err)
  }
}

const loginOptions = [
  { label: 'info.loginByAccount', icon: 'account', onClick: () => to(AUTH_ROUTES.LOGIN) },
  // {
  //   label: 'info.loginByApple',
  //   icon: 'apple',
  //   onClick: () =>
  //     onAppleSignIn({
  //       onSuccess: onAppleLoginSuccess,
  //       onFailure: (e) => console.error(`Apple SignIn Failed`, e),
  //     }),
  // },
  { label: 'info.loginByGoogle', icon: 'google', onClick: googleLogin },
  { label: 'info.loginByTwitter', icon: 'twitter', onClick: twitterLogin },
]

const { open } = useModalStore()
const { t: $t } = useI18n()

function openTermsOfService() {
  open(MODAL_TYPE.TERMS_OF_SERVICE, {
    title: $t('title.tos'),
    size: 'lg',
    confirmText: $t('common.confirm'),
    confirmAction: () => {},
  })
}

function openPrivacyPolicy() {
  open(MODAL_TYPE.PRIVACY_POLICY, {
    title: $t('title.pp'),
    size: 'lg',
    confirmText: $t('common.confirm'),
    confirmAction: () => {},
  })
}
</script>
