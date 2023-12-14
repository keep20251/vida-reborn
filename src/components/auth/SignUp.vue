<template>
  <div>
    <div class="w-full text-center">
      <div class="relative mb-20 flex h-[2.99999625rem] w-full items-center justify-center">
        <div class="absolute top-30 text-[0.875rem] font-bold leading-[1.125rem]">登入</div>
      </div>
      <div class="mb-30 px-20">
        <div class="flex flex-col gap-y-10">
          <InputWrap v-model="accountValue" :title="'帳號'" :placeholder="'請輸入帳號'"></InputWrap>
          <InputWrap v-model="passwordValue" :title="'密碼'" :placeholder="'請輸入密碼'"></InputWrap>
        </div>
      </div>
      <div class="mb-30 flex justify-center gap-x-10 px-20">
        <Button cancel @click="close">取消</Button>
        <Button>確認</Button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useAuthRouteStore } from '@/store/auth-route'
import InputWrap from '@comp/form/InputWrap.vue'
import Button from '@comp/common/Button.vue'
import { ref } from 'vue'

const { close } = useAuthRouteStore()
const accountValue = ref('')
const passwordValue = ref('')
</script>
