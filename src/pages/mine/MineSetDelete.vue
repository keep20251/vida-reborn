<template>
  <div class="border-t pt-20">
    <div class="space-y-20">
      <div class="text-gray-57 mb-10 text-base font-normal leading-lg">
        {{ $t('content.delAccContent') }} example@mail.com
      </div>
      <InputWrap v-model="nowPw" :label="$t('label.nowPw')" :placeholder="$t('placeholder.nowPw')" password></InputWrap>
      <Button @click="deleteAcc">{{ $t('content.delAcc') }}</Button>
      <div v-if="!!serverError" class="text-sm font-normal leading-md text-warning">{{ serverError }}</div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { useAccountStore } from '@/store/account'
import Button from '@comp/common/Button.vue'
import InputWrap from '@comp/form/InputWrap.vue'
import useRequest from '@use/request/index.js'

const accountStore = useAccountStore()
const { logout } = accountStore

const nowPw = ref('')

const serverError = ref('')
async function deleteAcc() {
  const { execute } = useRequest('User.deleteAccount')
  try {
    await execute({
      old_password: nowPw.value,
    })
    console.log('成功囉！')
    setTimeout(() => {
      logout()
    }, 500)
  } catch (e) {
    serverError.value = e.message
    console.error(e)
  }
}
</script>
