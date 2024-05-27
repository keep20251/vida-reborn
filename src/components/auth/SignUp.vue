<template>
  <div class="flex h-full w-full flex-col justify-center space-y-30">
    <DialogHeader :title="$t('label.register')" :history="history" :show-back="showBack" @back="back" @close="close">
      <template #default>
        <div class="flex flex-col space-y-32">
          <div class="flex flex-col space-y-16">
            <InputWrap
              v-model="credential.email.value"
              :err-msg="credential.email.error"
              :label="$t('label.email')"
              :placeholder="$t('placeholder.email')"
              :label-icon="'info'"
              :tip="tip"
              @click:labelIcon="openTip"
              @keypress:enter="submit"
            >
            </InputWrap>
            <InputWrap
              v-model="credential.account.value"
              :err-msg="credential.account.error"
              :label="$t('label.account')"
              :placeholder="$t('placeholder.account')"
              @keypress:enter="submit"
            ></InputWrap>
            <InputWrap
              v-model="credential.password.value"
              :err-msg="credential.password.error"
              :label="$t('label.password')"
              :placeholder="$t('placeholder.password')"
              @keypress:enter="submit"
              password
            ></InputWrap>
            <div>
              <div class="text-base font-semibold text-red-600">
                {{ $t('info.pwdStrength') }}<span>{{ $t(strengthText) }}</span>
              </div>
              <PasswordValidation
                :password="credential.password.value"
                @update:validate="(v) => (passwordValidation = v)"
              ></PasswordValidation>
            </div>

            <Button :loading="isLoading" @click="submit">{{ $t('label.submit') }}</Button>
          </div>
          <div class="text-center text-base leading-md text-gray-57">
            <span>
              {{ $t('info.alreadyRegister') }}
              <button class="underline" @click="to(AUTH_ROUTES.LOGIN)">
                {{ $t('info.clickToLogin') }}
              </button>
            </span>
          </div>
        </div>
      </template>
    </DialogHeader>
  </div>
</template>
<script setup>
import debounce from 'lodash/debounce'
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAccountStore } from '@/store/account'
import { useAuthRouteStore } from '@/store/auth-route'
import { useEmailLoginStore } from '@/store/email-login'
import { useModalStore } from '@/store/modal'
import Button from '@comp/common/Button.vue'
import DialogHeader from '@comp/dialog/DialogHeader.vue'
import InputWrap from '@comp/form/InputWrap.vue'
import PasswordValidation from '@comp/form/PasswordValidation.vue'
import useRequest from '@use/request/index.js'
import { useYup } from '@use/validator/yup.js'
import { AUTH_ROUTES, MODAL_TYPE } from '@const'

const { open } = useModalStore()
const authRouteStore = useAuthRouteStore()
const { to, back, close } = authRouteStore
const { history } = storeToRefs(authRouteStore)
const showBack = computed(() => history.value.length > 0)
const emailLoginStore = useEmailLoginStore()
const { credential, checkEmailExist } = storeToRefs(emailLoginStore)
const { Yup, validate } = useYup()
const { string } = Yup

const showTip = ref(false)
const tip = computed(() => {
  return showTip.value ? $t('info.unboundMailPrompt') : ''
})
const openTip = () => {
  setTimeout(() => {
    showTip.value = true
    setTimeout(() => {
      showTip.value = false
    }, 3000)
  }, 100)
}
openTip()

const { execute } = useRequest('Account.emailUsed')

async function checkEmail(email) {
  try {
    await execute({ email })
    credential.value.email.error = ''
    credential.value.email.check = true
    checkEmailExist.value = true
  } catch (e) {
    credential.value.email.error = e.message
    credential.value.email.check = false
    checkEmailExist.value = false
  }
}

watch(() => credential.value.email.value, debounce(checkEmail, 800))

const passwordValidation = ref(false)
const weakSchema = computed(() => string().weakPassword().isValidSync(credential.value.password.value))
const mediumSchema = computed(() => string().mediumPassword().isValidSync(credential.value.password.value))
const strongSchema = computed(() => string().strongPassword().isValidSync(credential.value.password.value))

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
      validate(credential.value.email.schema, credential.value.email),
      validate(credential.value.account.schema, credential.value.account),
      validate(credential.value.password.schema, credential.value.password),
    ])

    if (Object.values(credential.value).some((item) => item.check === false)) return
    if (checkEmailExist.value === false) return
    if (passwordValidation.value === false) return

    register()
  } catch (e) {
    console.error(e)
  }
}

const accountStore = useAccountStore()
const { login } = accountStore

const isLoading = ref(false)

const modalStore = useModalStore()
const { open: openModal, close: closeModal } = modalStore

const { push } = useRouter()
const { t: $t } = useI18n()

async function register() {
  isLoading.value = true
  const { data, execute } = useRequest('Account.registerByPassword')
  try {
    await execute({
      email: credential.value.email.value,
      account: credential.value.account.value,
      password: credential.value.password.value,
    })

    await login(data.value.token)

    // 同步訪客階段初次進站選擇的興趣清單
    // const interestedList = useLocalStorage(LOCAL_STORAGE_KEYS.INTERESTED_LIST, [])
    // const interested = interestedList.value.join(',')
    // await useRequest('User.modifyInfo', { params: { interested }, immediate: true })
    // updateUserData({ interested })
    // interestedList.value = []

    close()
    openModal(MODAL_TYPE.SIGN_UP_SUCCESS, {
      size: 'lg',
      title: $t('info.registerSuccess'),
      showClose: false,
      confirmText: $t('common.goNow'),
      confirmAction: () => {
        closeModal()
        push({ name: 'mine-account' })
      },
      otherText: $t('common.getAround'),
      otherAction: () => {
        closeModal()
        push({ name: 'home' })
      },
    })
  } catch (e) {
    console.error(e)
    credential.value.account.error = e.message
  } finally {
    isLoading.value = false
  }
}
</script>
