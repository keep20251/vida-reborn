<template>
  <Page>
    <template #default>
      <div class="h-full w-full">
        <div class="m-16 p-16">
          <h5 class="text-xl font-bold">
            <span class="text-red-500">Goo</span>
            <span class="text-yellow-500">gle</span>
            <span class="text-green-500">Au</span>
            <span class="text-blue-500">th</span>
          </h5>
          <button class="w-80 bg-blue-500 px-8 py-1 text-white" @click="googleLogin">Login</button>
        </div>
        <div class="m-16 p-16">
          <h5 class="text-xl font-bold text-blue-500">Twitter</h5>
          <button class="w-80 bg-blue-500 px-8 py-1 text-white" @click="twitterLogin">Login</button>
        </div>
      </div>
    </template>
  </Page>
</template>
<script setup>
import { useRoute } from 'vue-router'
import { onMounted } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import useRequest from '@/compositions/request'

/** 第三方登入後重定向的網址，告訴 Google, Twitter 要往哪個網址送GET參數過去 */
const redirect_uri = `${import.meta.env.VITE_APP_URL}/devmode/google`

/**
 * 向後端請求取得 Twitter 登入頁面的網址
 */
const { data: twitterRedirection, execute: getRedirectToTwitter } = useRequest('ThirdParty.getRedirectToTwitter', {
  params: {
    oauth_callback: redirect_uri,
  },
  onSuccess: (responseData) => {
    console.log('onSuccess', responseData)
  },
})

const twitterOAuth = useLocalStorage('twitterOAuth', {})

async function twitterLogin() {
  await getRedirectToTwitter()
  twitterOAuth.value = twitterRedirection.value.data
  window.location.href = twitterRedirection.value.data.url
}

const route = useRoute()

/**
 * Twitter 登入成功後，Twitter 會將 oauth_verifier, oauth_token, oauth_token_secret 這三個參數帶在網址上
 * 然後再向後端請求取得 token
 */
function onTwitterLoginSuccess() {
  useRequest('ThirdParty.loginByTwitter', {
    params: {
      oauth_verifier: route.query.oauth_verifier,
      oauth_token: route.query.oauth_token,
      oauth_token_secret: twitterOAuth.value.oauth_token_secret,
    },
    onSuccess: (responseData) => {
      alert(`Twitter login success! token:${responseData.data.token}`)
      twitterOAuth.value = {}
    },
    immediate: true,
  })
}

/**
 * 向後端請求取得 Google 登入頁面的網址
 */
const { data: googleRedirection, execute: getGoogleOuathPage } = useRequest('ThirdParty.getGoogleOauthPage', {
  params: {
    redirect_uri,
  },
  onSuccess: (responseData) => {
    console.log('onSuccess', responseData)
  },
})

const googleOAuth = useLocalStorage('googleOAuth', {})

async function googleLogin() {
  await getGoogleOuathPage()
  console.log('googleRedirection', googleRedirection.value.data.url)

  googleOAuth.value = googleRedirection.value.data
  window.location.href = googleRedirection.value.data.url
}

/**
 * Google 登入成功後，Google 會將 code 這個參數帶在網址上
 * 然後再向後端請求取得 token
 */
async function onGoogleLoginSuccess() {
  console.log('onGoogleLoginSuccess', route.query.code)
  const googleCode = decodeURIComponent(route.query.code)
  useRequest('ThirdParty.webLoginByGoogle', {
    params: {
      redirect_uri,
      google_code: googleCode,
    },
    onSuccess: (responseData) => {
      alert(`Google login success! token:${responseData.data.token}`)
      // googleOAuth.value = {}
    },
    immediate: true,
  })
}

// TODO 先用同一頁做重新定向的網址，之後再改成另一個頁面
onMounted(async () => {
  if (
    twitterOAuth.value.oauth_token &&
    twitterOAuth.value.oauth_token_secret &&
    route.query.oauth_verifier &&
    route.query.oauth_token
  ) {
    await onTwitterLoginSuccess()
  }

  if (route.query.code) {
    await onGoogleLoginSuccess()
  }
})
</script>
