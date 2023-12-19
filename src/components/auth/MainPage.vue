<template>
  <div>
    <div class="flex w-full flex-col justify-center gap-y-30 last:mb-30">
      <div class="relative mb-20 flex h-[2.99999625rem] w-full items-center justify-center">
        <div class="absolute right-20 top-20 cursor-pointer" @click="close">
          <Icon name="close"></Icon>
        </div>
      </div>
      <div class="flex flex-col justify-center gap-y-10 px-20">
        <InputWrap v-model="email" title="電子郵箱" placeholder="請輸入電子郵箱"></InputWrap>
        <Button @click="to(AUTH_ROUTES.SIGN_UP)">下一步</Button>
      </div>
      <div class="text-center">登入或快速註冊</div>
      <div class="flex flex-col justify-center gap-y-16 px-20">
        <button class="rounded-md border border-black py-8 text-center">使用 Account 登入</button>
        <button
          class="rounded-md border border-black py-8 text-center"
          @click="
            onAppleSignIn({
              onSuccess: onAppleLoginSuccess,
              onFailure: (e) => console.error(`Apple SignIn Failed`, e),
            })
          "
        >
          使用 Apple 登入或註冊
        </button>
        <button class="rounded-md border border-black py-8 text-center" @click="googleLogin">
          使用 Google 登入或註冊
        </button>
        <button class="rounded-md border border-black py-8 text-center" @click="twitterLogin">
          使用 Twitter 登入或註冊
        </button>
      </div>
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

const { twitterLogin, googleLogin, onAppleSignIn, redirect_uri } = useThirdPartyAuth()
const { to, close } = useAuthRouteStore()
const { setToken } = useAccountStore()

const email = ref('')

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
      setToken(responseData.data.token)
    },
    onError: (err) => {
      console.error(err)
    },
    immediate: true,
  })
}
</script>
