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
import Page from '@/components/layout/Page.vue'
import { useRoute } from 'vue-router'
import { onMounted, onServerPrefetch } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import API from '@/http'

onServerPrefetch(async () => {
  const response = await API.ThirdParty.getRedirectToTwitter({
    data: {
      oauth_callback: `http://localhost:3001/devmode/google`,
    },
  })
  console.log('response', response.data.data)
})

function googleLogin(event) {
  console.log('event', event)
}

const twitterOAuth = useLocalStorage('twitterOAuth', {})
const googleOAuth = useLocalStorage('googleOAuth', {})

async function twitterLogin() {
  try {
    const response = await API.ThirdParty.getRedirectToTwitter({
      data: {
        oauth_callback: `http://localhost:3001/devmode/google`,
      },
    })
    console.log('response', response)

    if (response.status === 200) {
      twitterOAuth.value = response.data.data
      window.location.href = response.data.data.url
    }
  } catch (e) {
    console.error(e)
  }
}

onMounted(async () => {
  try {
    const route = useRoute()
    console.log('route', !!twitterOAuth.value)
    if (twitterOAuth.value.oauth_token && twitterOAuth.value.oauth_token_secret) {
      const response = await API.ThirdParty.loginByTwitter({
        data: {
          oauth_verifier: route.query.oauth_verifier,
          oauth_token: route.query.oauth_token,
          oauth_token_secret: twitterOAuth.value.oauth_token_secret,
        },
      })

      if (response.status === 200) {
        alert(`Twitter Login Success, Token:${response.data.data.token}`)
        twitterOAuth.value = {}
      }
    }
  } catch (e) {
    console.error(e)
  }
})
</script>
