<template>
  <div>
    <div class="flex pt-8">
      <div class="text-base font-bold leading-md">{{ $t('content.currentEarn') }}</div>
    </div>
    <div class="flex items-end justify-center space-x-5 py-35">
      <div class="text-base font-bold leading-md">$</div>
      <div class="text-xl font-bold leading-xl">5,000,000</div>
    </div>
    <InputWrap
      v-model="wdrlAmount"
      :label="$t('label.wdrlAmount')"
      :placeholder="$t('placeholder.wdrlAmount')"
    ></InputWrap>
    <ol class="!list-decimal pb-20 pl-20 pt-10 text-base font-normal leading-xl text-gray-cc">
      <li>提款金額須至少100美金以上。</li>
      <li>數字不可大於目前收益。</li>
      <li>提出後將於24小時內審核，審核結果將於提交紀錄中展示。</li>
    </ol>
    <Button>{{ $t('content.withdrawalApply') }}</Button>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import Button from '@comp/common/Button.vue'
import InputWrap from '@comp/form/InputWrap.vue'

const wdrlAmount = ref(null)
</script>
