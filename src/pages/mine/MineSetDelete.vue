<template>
  <div class="border-t pt-20">
    <div class="space-y-20">
      <div class="mb-10 text-base font-normal leading-lg text-gray66">
        Deleting your account will permanently remove all of your information and media from our database. It also
        revokes all active media consents.If you encounter any issues please contact example@mail.com
      </div>
      <div class="text-sm font-normal leading-3 text-warning">It can’t be restored!</div>
      <InputWrap v-model="inputValue" :label="'目前的密码'" :placeholder="'请输入当前密码'" password></InputWrap>
      <Button @click="onBtnClick('contrast button')">刪除帳號</Button>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import InputWrap from '@comp/form/InputWrap.vue'
import Button from '@comp/common/Button.vue'

const inputValue = ref('')
</script>
