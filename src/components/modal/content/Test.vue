<template>
  <div class="flex flex-col">
    <label>請輸入資料</label>
    <input v-model="v" type="text" />
    <div v-if="errMsg" class="text-sm text-warning">{{ errMsg }}</div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useConfirmData } from '@/compositions/modal/confirm-data'

const v = ref('')
const errMsg = ref('')

useConfirmData(validator)

async function validator() {
  // 非同步也沒問題了
  await new Promise((resolve) => {
    setTimeout(resolve, 3000)
  })

  // 驗證資料沒通過回傳 fasle
  if (v.value === '') {
    errMsg.value = '不能為空哦'
    return false
  }

  // 驗證資料通過打包成想回傳的樣子回傳
  const data = { input: v.value }

  // 重置資料內容
  reset()

  return data
}

function reset() {
  v.value = ''
  errMsg.value = ''
}
</script>
