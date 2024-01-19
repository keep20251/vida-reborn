<template>
  <div class="grid space-y-20 border-t pt-20">
    <InputWrap
      v-model="credential.nowPw.value"
      :err-msg="credential.nowPw.error"
      :label="'目前的密码'"
      :placeholder="'请输入当前密码'"
      password
    ></InputWrap>
    <div class="grid space-y-10">
      <InputWrap
        v-model="credential.newPw.value"
        :err-msg="credential.newPw.error"
        :label="'新的密码'"
        :placeholder="'请输入新密码'"
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
      :label="'密码确认'"
      :placeholder="'请再输入一次新密码'"
      password
    ></InputWrap>

    <Button @click="submit">保存</Button>
  </div>
</template>
<script setup>
import { ref, reactive, computed } from 'vue'
import InputWrap from '@comp/form/InputWrap.vue'
import Button from '@comp/common/Button.vue'
import { useYup } from '@use/validator/yup.js'
import PasswordValidation from '@/components/form/PasswordValidation.vue'

const { Yup, validate } = useYup()
const { string } = Yup
const credential = reactive({
  nowPw: {
    value: '',
    error: '',
    check: false,
    schema: Yup.string().required(),
  },
  newPw: {
    value: '',
    error: '',
    check: false,
    schema: Yup.string().required(),
  },
  newPwCfm: {
    value: '',
    error: '',
    check: false,
    schema: Yup.string().required(),
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

async function submit() {
  try {
    await Promise.all([
      validate(credential.nowPw.schema, credential.nowPw),
      validate(credential.newPw.schema, credential.newPw),
      validate(credential.newPwCfm.schema, credential.newPwCfm),
    ])

    if (Object.values(credential).some((item) => item.check === false)) return
    if (passwordValidation.value === false) return
    if (credential.newPw.value === credential.newPwCfm.value) return
    console.log('驗證都通過了，可以送出惹')
  } catch (e) {
    console.log(e)
  }
}
</script>
