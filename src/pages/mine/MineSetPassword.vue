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
    <div v-if="!!serverError" class="leading-md text-sm font-normal text-warning">{{ serverError }}</div>
  </div>
</template>
<script setup>
import { ref, reactive, computed } from 'vue'
import InputWrap from '@comp/form/InputWrap.vue'
import Button from '@comp/common/Button.vue'
import { useYup } from '@use/validator/yup.js'
import PasswordValidation from '@/components/form/PasswordValidation.vue'
import useRequest from '@use/request/index.js'

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
    if (credential.newPw.value === credential.newPwCfm.value) {
      console.log(credential.newPw.value === credential.newPwCfm.value, '確認一樣你們有沒有長的一樣樣')
    } else {
      console.log('我們不一樣')
    }
    changePw()
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
    console.log('成功囉！')
  } catch (e) {
    serverError.value = e.message
    console.error(e)
  }
}
</script>
