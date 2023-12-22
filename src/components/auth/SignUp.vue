<template>
  <div class="flex w-full flex-col justify-center gap-y-30 px-32 pb-16 pt-32 last:mb-16">
    <DialogHeader title="註冊" :history="history" :show-back="showBack" @back="back" @close="close">
      <template #default>
        <div class="flex flex-col gap-y-32">
          <div class="flex flex-col gap-y-16">
            <InputWrap v-model="credential.username" title="電子郵箱" placeholder="請輸入電子郵箱"></InputWrap>
            <InputWrap v-model="credential.account" title="登入帳號" placeholder="請輸入帳號"></InputWrap>
            <InputWrap v-model="credential.password" title="密碼" placeholder="輸入密碼"></InputWrap>
            <Button @click="to(AUTH_ROUTES.SIGN_UP_SUCCESS)">提交</Button>
          </div>
        </div>
      </template>
    </DialogHeader>
  </div>
</template>
<script setup>
import { useAuthRouteStore } from '@/store/auth-route'
import DialogHeader from '@/components/dialog/DialogHeader.vue'
import InputWrap from '@/components/form/InputWrap.vue'
import Button from '@/components/common/Button.vue'
import { AUTH_ROUTES } from '@/constant'
import { computed, reactive } from 'vue'
import { storeToRefs } from 'pinia'

const authRouteStore = useAuthRouteStore()
const { to, back, close } = authRouteStore
const { history } = storeToRefs(authRouteStore)
const showBack = computed(() => history.value.length > 0)

const credential = reactive({
  username: '',
  account: '',
  password: '',
})
</script>
