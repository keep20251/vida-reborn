<template>
  <div class="grid space-y-20 border-t pt-20">
    <InputWrap
      v-model="credential.nowPw.value"
      :err-msg="credential.nowPw.error"
      :label="$t('label.nowPw')"
      :placeholder="$t('placeholder.nowPw')"
      password
    ></InputWrap>
    <div class="grid space-y-10">
      <InputWrap
        v-model="credential.newPw.value"
        :err-msg="credential.newPw.error"
        :label="$t('label.newPw')"
        :placeholder="$t('placeholder.newPw')"
        password
      ></InputWrap>
      <div class="grid space-y-10">
        <div class="text-base font-semibold text-red-600">
          {{ $t('info.pwdStrength') }}<span>{{ $t(strengthText) }}</span>
        </div>
        <PasswordValidation
          :password="credential.newPw.value"
          @update:validate="(v) => (passwordValidation = v)"
        ></PasswordValidation>
      </div>
    </div>
    <InputWrap
      v-model="credential.newPwCfm.value"
      :err-msg="credential.newPwCfm.error"
      :label="$t('label.newPwCfm')"
      :placeholder="$t('placeholder.newPwCfm')"
      password
    ></InputWrap>

    <Button :loading="isLoading" @click="submit">{{ $t('common.confirm') }}</Button>
    <div v-if="!!serverError" class="text-sm font-normal leading-md text-warning">{{ serverError }}</div>
  </div>
</template>
<script setup>
import { computed, reactive, ref } from 'vue'
import { useModalStore } from '@/store/modal'
import Button from '@comp/common/Button.vue'
import InputWrap from '@comp/form/InputWrap.vue'
import PasswordValidation from '@comp/form/PasswordValidation.vue'
import useRequest from '@use/request/index.js'
import { useYup } from '@use/validator/yup.js'

const { confirm } = useModalStore()
const { Yup, validate } = useYup()
const { string } = Yup
const credential = reactive({
  nowPw: {
    value: '',
    error: '',
    check: false,
    schema: string().required(),
  },
  newPw: {
    value: '',
    error: '',
    check: false,
    schema: string().required(),
  },
  newPwCfm: {
    value: '',
    error: '',
    check: false,
    schema: string().required(),
  },
})

const passwordValidation = ref(false)
const weakSchema = computed(() => string().weakPassword().isValidSync(credential.newPw.value))
const mediumSchema = computed(() => string().mediumPassword().isValidSync(credential.newPw.value))
const strongSchema = computed(() => string().strongPassword().isValidSync(credential.newPw.value))

const strengthText = computed(() => {
  const schema = [weakSchema, mediumSchema, strongSchema].filter((item) => item.value !== false)
  switch (schema.length) {
    case 3:
      return 'info.strength.strong'
    case 2:
      return 'info.strength.medium'
    case 1:
    case 0:
    default:
      return 'info.strength.weak'
  }
})

const isLoading = ref(false)

async function submit() {
  try {
    isLoading.value = true
    await Promise.all([
      validate(credential.nowPw.schema, credential.nowPw),
      validate(credential.newPw.schema, credential.newPw),
      validate(credential.newPwCfm.schema, credential.newPwCfm),
    ])

    if (passwordValidation.value === false) return

    confirm({
      size: 'sm',
      title: 'beCreator.title.reConfirm',
      content: 'info.whetherChangePw',
      confirmAction: () => {
        changePw()
      },
    })
  } catch (e) {
    console.error(e)
  } finally {
    isLoading.value = false
  }
}

const serverError = ref('')
async function changePw() {
  const { execute } = useRequest('User.changePassword', {})
  try {
    await execute({
      old_password: credential.nowPw.value,
      new_password: credential.newPw.value,
      new_password_confirm: credential.newPwCfm.value,
    })
    serverError.value = ''
  } catch (e) {
    serverError.value = e.message
    console.error(e)
  }
}
</script>
