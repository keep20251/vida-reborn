<template>
  <div class="grid space-y-20 border-t pt-20">
    <div class="flex flex-col space-y-10">
      <div class="flex justify-between">
        <div class="flex items-center space-x-10">
          <div class="leading-lg text-base font-normal">目前的邮箱</div>
          <div class="text-sm font-normal leading-3 text-warning">尚未验证</div>
        </div>
        <div class="leading-lg cursor-pointer text-base font-normal text-primary">Edit</div>
      </div>
      <div class="text-sm font-normal leading-3 text-gray66">example55688@gmail.com</div>
    </div>
    <InputWrap
      v-model="inputValue"
      :label="'邮箱验证码'"
      :placeholder="'请输入邮箱验证码'"
      :appendText="'送出验证码'"
      :maxLength="8"
    ></InputWrap>
    <Button @click="onBtnClick('contrast button')" contrast>提交验证</Button>
    <InputWrap v-model="inputValue" :label="'显示名称'" :placeholder="'请输入显示名称'"></InputWrap>
    <InputWrap v-model="inputValue" :label="'用户名'" :sublabel="`@username`" :placeholder="'请输入用户名'"></InputWrap>
    <Button @click="onBtnClick('contrast button')">保存</Button>
    <div class="leading-lg mb-20 pt-10 text-center text-base font-normal">绑定第三方登入</div>
    <div class="flex w-full flex-col items-center space-y-10">
      <div
        class="flex w-3/6 cursor-pointer items-center justify-center space-x-10 rounded-full border border-gray30 py-10"
      >
        <Icon name="google" size="15"></Icon>
        <div class="leading-lg text-base font-normal">与 Google 绑定</div>
      </div>
      <div
        class="flex w-3/6 cursor-pointer items-center justify-center space-x-10 rounded-full border border-gray30 py-10"
      >
        <Icon name="facebook" size="15"></Icon>
        <div class="leading-lg text-base font-normal">与 Facebook 绑定</div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import InputWrap from '@comp/form/InputWrap.vue'
import Button from '@comp/common/Button.vue'

const inputValue = ref('')
</script>
