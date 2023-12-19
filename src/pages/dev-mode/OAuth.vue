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
        <div class="m-16 p-16">
          <h5 class="text-xl font-bold text-blue-500">Apple SignIn with EventListener</h5>
          <div id="appleid-signin" data-color="light" data-border="true" data-type="sign in" class="h-32 w-full"></div>
        </div>
        <div class="m-16 p-16">
          <h5 class="text-xl font-bold text-blue-500">Apple SignIn with Custom Trigger</h5>
          <button
            class="h-32 w-full rounded-lg border border-black"
            @click="
              onAppleSignIn({
                onSuccess: onAppleLoginSuccess,
                onFailure: (e) => console.error(`Apple SignIn Failed`, e),
              })
            "
          >
            Apple Sign In
          </button>
        </div>
        <div class="m-16 flex flex-row gap-x-16 p-16">
          <button class="w-80 bg-blue-500 px-8 py-1 text-white" @click="() => (authDialog = true)">Login</button>
          <button class="w-80 bg-blue-500 px-8 py-1 text-white" @click="logout">Logout</button>
        </div>
      </div>
    </template>
  </Page>
</template>
<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useThirdPartyAuth } from '@/compositions/request/third-party-auth'
import { useAccountStore } from '@/store/account'
import { useDialogStore } from '@/store/dialog'
import { storeToRefs } from 'pinia'

const { authDialog } = storeToRefs(useDialogStore())

const { logout } = useAccountStore()

const { twitterLogin, googleLogin, bindAppleEvent, unbindAppleEvent, onAppleSignIn, onAppleLoginSuccess } =
  useThirdPartyAuth()

onMounted(async () => {
  bindAppleEvent({
    onSuccess: onAppleLoginSuccess,
    onFailure: () => console.error('onFailure'),
  })
})

onUnmounted(() => {
  unbindAppleEvent()
})
</script>
