<template>
  <Page>
    <template #default>
      <div class="mt-32 w-full p-8">
        <div class="bg-slate-200">
          <div class="flex flex-col justify-center gap-4 align-middle">
            <div class="flex justify-center align-middle">
              <div class="text-xl text-red-500">
                Token:
                <pre class="text-pink-400">{{ cookies.get('_AUTH') || 'undefined' }}</pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </Page>
</template>
<script setup>
import Page from '@/components/layout/Page.vue'
import { useCookies } from '@vueuse/integrations/useCookies'
import { onMounted } from 'vue'

const cookies = useCookies()

onMounted(() => {
  const fakeToken = {
    accessToken: 'access-token:' + Date.now(),
    refreshToken: 'refresh-token:' + Date.now(),
  }
  const json = JSON.stringify(fakeToken)
  if (!cookies.get('_AUTH')) {
    cookies.set('_AUTH', json, { path: '/' })
    console.log(`setCookie`, cookies.get('_AUTH'))
  }
})
</script>
