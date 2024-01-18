<template>
  <div class="flex w-full flex-col justify-center gap-y-30 px-32 pb-16 pt-32 last:mb-16">
    <DialogHeader :title="$t('label.register')" :history="history" :show-back="showBack" @back="back" @close="close">
      <template #default>
        <div class="flex flex-col gap-y-32">
          <div class="flex flex-col gap-y-16">
            <InputWrap
              v-model="credential.email.value"
              :err-msg="credential.email.error"
              :label="$t('label.email')"
              :placeholder="$t('placeholder.email')"
            ></InputWrap>
            <InputWrap
              v-model="credential.account.value"
              :err-msg="credential.account.error"
              :label="$t('label.account')"
              :placeholder="$t('placeholder.account')"
            ></InputWrap>
            <InputWrap
              v-model="credential.password.value"
              :err-msg="credential.password.error"
              :label="$t('label.password')"
              :placeholder="$t('placeholder.password')"
              password
            ></InputWrap>
            <div>
              <PasswordValidation
                :password="credential.password.value"
                @update:validate="(v) => (passwordValidation = v)"
              ></PasswordValidation>
              <div class="text-base font-semibold text-red-600">
                {{ $t('info.pwdStrength') }}<span>{{ $t(strengthText) }}</span>
              </div>
            </div>

            <Button :loading="isLoading" @click="submit">{{ $t('label.register') }}</Button>
          </div>
        </div>
      </template>
    </DialogHeader>
  </div>
</template>
<script setup>
import DialogHeader from '@/components/dialog/DialogHeader.vue'
import InputWrap from '@/components/form/InputWrap.vue'
import Button from '@/components/common/Button.vue'
import PasswordValidation from '@/components/form/PasswordValidation.vue'
import useRequest from '@use/request/index.js'
import debounce from 'lodash/debounce'
import { AUTH_ROUTES } from '@/constant'
import { computed, reactive, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useYup } from '@use/validator/yup.js'
import { useAccountStore } from '@/store/account'
import { useAuthRouteStore } from '@/store/auth-route'

const authRouteStore = useAuthRouteStore()
const { to, back, close } = authRouteStore
const { history } = storeToRefs(authRouteStore)
const showBack = computed(() => history.value.length > 0)

const { Yup, validate } = useYup()
const { string } = Yup

const credential = reactive({
  email: {
    value: '',
    error: '',
    check: false,
    schema: Yup.string().required().email(),
  },
  account: {
    value: '',
    error: '',
    check: false,
    schema: Yup.string().required(),
  },
  password: {
    value: '',
    error: '',
    check: false,
    schema: Yup.string().required(),
  },
})

const { execute } = useRequest('Account.emailUsed', {})

const checkEmailExist = ref(false)
async function checkEmail(email) {
  try {
    await execute({ email })
    credential.email.error = ''
    credential.email.check = true
    checkEmailExist.value = true
  } catch (e) {
    credential.email.error = e.message
    credential.email.check = false
    checkEmailExist.value = false
  }
}

watch(() => credential.email.value, debounce(checkEmail, 800))

const passwordValidation = ref(false)
const weakSchema = computed(() => string().weakPassword().isValidSync(credential.password.value))
const mediumSchema = computed(() => string().mediumPassword().isValidSync(credential.password.value))
const strongSchema = computed(() => string().strongPassword().isValidSync(credential.password.value))

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
      validate(credential.email.schema, credential.email),
      validate(credential.account.schema, credential.account),
      validate(credential.password.schema, credential.password),
    ])

    if (Object.values(credential).some((item) => item.check === false)) return
    if (checkEmailExist.value === false) return
    if (passwordValidation.value === false) return

    register()
  } catch (e) {
    console.error(e)
  }
}

const accountStore = useAccountStore()
const { setToken } = accountStore

const isLoading = ref(false)

async function register() {
  isLoading.value = true
  const { data, execute } = useRequest('Account.registerByPassword', {})
  try {
    await execute({
      email: credential.email.value,
      account: credential.account.value,
      password: credential.password.value,
    })

    setToken(data.value.token)
    to(AUTH_ROUTES.SIGN_UP_SUCCESS)
  } catch (e) {
    console.error(e)
    credential.account.error = e.message
  } finally {
    isLoading.value = false
  }
}
</script>
