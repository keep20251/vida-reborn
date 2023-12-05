<template>
  <div class="m-100 w-full bg-white">
    <div class="mx-auto text-center">
      <div class="mx-auto flex h-100 w-100 items-center justify-center bg-primary">
        <div class="">Vida</div>
      </div>
      <div>登入或註冊</div>
      <button class="mx-16 my-8 px-16 py-8" @click="to(AUTH_ROUTES.SIGN_UP)">SignUp</button>
      <button class="mx-16 my-8 px-16 py-8" @click="close">Close</button>
    </div>
  </div>
</template>
<script setup>
import { useAuthRouteStore } from '@/store/auth-route'
import { AUTH_ROUTES } from '@/constant'

const { to, close } = useAuthRouteStore()
</script>
