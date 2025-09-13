<template>
  <div class="px-6 py-2">
    <p class="flex items-center text-xl font-semibold">👋 歡迎！</p>
    <p class="mt-2 text-gray-600">立即前往第一個創作者的頻道吧</p>
  </div>
  <div class="px-6 py-2">
    <div class="shadow rounded-lg bg-white p-6">
      <h3 class="mb-4 text-center font-medium">前往創作者頻道</h3>
      <div class="mb-4 flex items-center">
        <label for="creatorId" class="mr-2">創作者 @ID 號碼</label>
        <button class="ml-auto text-indigo-500" @click="handleScanCode">掃碼</button>
      </div>
      <InputWrap
        v-model="creatorId"
        id="creatorId"
        :placeholder="$t('placeholder.enterCreatorId')"
        class="mb-4"
        @keypress.enter="goToCreator"
      ></InputWrap>
      <Button gradient size="lg" class="w-full" @click="goToCreator">立即前往</Button>
    </div>
  </div>
  <div class="px-6 py-4 text-center">
    <p class="text-gray-500">我是創作者</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Button from '@comp/common/Button.vue'
import InputWrap from '@comp/form/InputWrap.vue'
import { useRouters } from '@/compositions/routers'

const { t: $t } = useI18n()
const creatorId = ref('')
const { toCreator } = useRouters()

function goToCreator() {
  if (creatorId.value.trim()) {
    // 移除可能的 '@' 符号前缀
    const username = creatorId.value.trim().replace(/^@/, '')
    toCreator(username)
  }
}

function handleScanCode() {
  // 实现扫码功能
  console.log('扫描二维码功能')
}
</script>
