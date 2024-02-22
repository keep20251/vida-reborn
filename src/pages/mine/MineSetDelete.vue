<template>
  <div class="border-t pt-20">
    <div class="space-y-20">
      <div class="mb-10 text-base font-normal leading-lg text-gray-57">
        {{ $t('content.delAccContent') }} example@mail.com
      </div>
      <InputWrap
        v-model="credential.nowPw.value"
        :label="$t('label.nowPw')"
        :placeholder="$t('placeholder.nowPw')"
        :errMsg="credential.nowPw.error"
        password
      ></InputWrap>
      <Button @click="submit">{{ $t('content.delAcc') }}</Button>
    </div>
  </div>
</template>
<script setup>
import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAccountStore } from '@/store/account'
import { useModalStore } from '@/store/modal'
import { usePopupMessageStore } from '@/store/popup-message'
import Button from '@comp/common/Button.vue'
import InputWrap from '@comp/form/InputWrap.vue'
import useRequest from '@use/request/index.js'
import { useYup } from '@use/validator/yup.js'

const accountStore = useAccountStore()
const { logout } = accountStore
const { open: openMessage } = usePopupMessageStore()
const { open, confirm } = useModalStore() // 解構出 open 方法

const { t: $t } = useI18n()
const { Yup, validate } = useYup()
const { string } = Yup
const credential = reactive({
  nowPw: {
    value: '',
    error: '',
    check: false,
    schema: string().required($t('yup.mixed.required')),
  },
})

async function submit() {
  await validate(credential.nowPw.schema, credential.nowPw)
  confirm({
    size: 'sm',
    title: 'beCreator.title.reConfirm',
    content: 'info.whetherDelAcc',
    confirmAction: () => {
      deleteAcc()
    },
  })
}

async function deleteAcc() {
  const { execute } = useRequest('User.deleteAccount')
  try {
    await execute({
      password: credential.nowPw.value,
    })
    console.log('成功囉！')
    setTimeout(() => {
      logout()
    }, 500)
  } catch (e) {
    credential.nowPw.error = e.message
    openMessage('content.error')
  }
}
</script>
