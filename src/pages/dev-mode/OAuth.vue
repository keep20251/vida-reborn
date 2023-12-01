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

function googleLogin(event) {
  console.log('event', event)
}

const twitterOAuth = useLocalStorage('twitterOAuth', {})
const googleOAuth = useLocalStorage('googleOAuth', {})

function twitterLogin() {
  useRequest('ThirdParty.getRedirectToTwitter', {
    params: {
      oauth_callback: `http://localhost:3001/devmode/google`,
    },
    onSuccess: (responseData) => {
      twitterOAuth.value = responseData.data
      window.location.href = responseData.data.url
    },
  })
}

const route = useRoute()
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
  })
}

onMounted(async () => {
  if (
    twitterOAuth.value.oauth_token &&
    twitterOAuth.value.oauth_token_secret &&
    route.query.oauth_verifier &&
    route.query.oauth_token
  ) {
    onTwitterLoginSuccess()
  }
})
</script>
