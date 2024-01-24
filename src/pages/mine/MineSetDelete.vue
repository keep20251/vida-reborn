<template>
  <div class="border-t pt-20">
    <div class="space-y-20">
      <div class="leading-lg mb-10 text-base font-normal text-gray66">{{ $t('content.delAccCnt') }}</div>
      <InputWrap
        v-model="inputValue"
        :label="$t('label.nowPw')"
        :placeholder="$t('placeholder.nowPw')"
        password
      ></InputWrap>
      <Button @click="onBtnClick('contrast button')">{{ $t('content.delAcc') }}</Button>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import Button from '@comp/common/Button.vue'
import InputWrap from '@comp/form/InputWrap.vue'

const inputValue = ref('')
</script>
