<template>
  <div class="grid space-y-20 border-t pt-20">
    <div class="flex flex-col space-y-10">
      <div class="flex justify-between">
        <div
          class="flex items-center space-x-10"
          :class="[{ 'w-full': userData.email_validation === EMAIL_VALIDATION.VERIFIED }]"
        >
          <div class="text-base font-normal leading-lg">{{ $t('label.nowEmail') }}</div>
          <div
            class="text-sm font-normal leading-3"
            :class="[
              {
                'text-warning': userData.email_validation === EMAIL_VALIDATION.UNVERIFIED,
                'text-gray-57': userData.email_validation === EMAIL_VALIDATION.VERIFIED,
              },
            ]"
          >
            {{
              userData.email_validation === EMAIL_VALIDATION.UNVERIFIED ? $t('label.unverified') : $t('label.verified')
            }}
          </div>
        </div>
        <div
          class="text-gray cursor-pointer whitespace-nowrap text-base font-normal leading-lg text-primary"
          @click="confirmEmail"
        >
          {{ edit ? $t('common.confirm') : $t('label.edit') }}
        </div>
      </div>
      <InputWrap
        v-if="edit"
        v-model="credential.email.value"
        :placeholder="$t('placeholder.email')"
        :errMsg="credential.email.error"
      ></InputWrap>
      <div v-if="!edit" class="text-sm font-normal leading-3 text-gray-57">{{ credential.email.value }}</div>
    </div>
    <InputEmailCode
      v-if="userData.email_validation === EMAIL_VALIDATION.UNVERIFIED && !edit"
      v-model="verifyCode"
      :onResend="resendEmailCode"
      :err-msg="verifyCodeError"
      :first-time="false"
      @update:modelValue="verifyCodeError = ''"
      @error="(message) => (serverError = message)"
    ></InputEmailCode>
    <div class="grid space-y-5" v-if="userData.email_validation === EMAIL_VALIDATION.UNVERIFIED">
      <Button :loading="isLoading" @click="validateEmailCode" contrast>{{ $t('label.submit') }}</Button>
      <div v-if="!!serverError" class="text-sm font-normal leading-md text-warning">{{ serverError }}</div>
    </div>
    <InputWrap
      v-model="credential.nickname.value"
      :label="$t('label.displayName')"
      :placeholder="$t('placeholder.displayName')"
      :errMsg="credential.nickname.error"
    ></InputWrap>
    <InputWrap
      v-model="credential.username.value"
      :label="$t('label.account')"
      :sublabel="`@${credential.username.value}`"
      :placeholder="$t('placeholder.username')"
      :errMsg="credential.username.error"
    ></InputWrap>

    <div>
      <Button @click="saveUserName">{{ $t('common.save') }}</Button>
      <div v-if="!!nameServerError" class="text-sm font-normal leading-md text-warning">{{ nameServerError }}</div>
    </div>

    <div class="mb-20 pt-10 text-center text-base font-normal leading-lg">{{ $t('info.bindThirdPartyLogin') }}</div>
    <div class="flex w-full flex-col items-center space-y-10">
      <div
        class="flex w-3/6 cursor-pointer items-center justify-center space-x-10 rounded-full border border-gray-a3 py-10"
        @click="googleLogin"
      >
        <Icon name="google" size="15"></Icon>
        <div class="text-base font-normal leading-lg">{{ $t('info.bindGoogle') }}</div>
      </div>
      <div
        class="flex w-3/6 cursor-pointer items-center justify-center space-x-10 rounded-full border border-gray-a3 py-10"
        @click="twitterLogin"
      >
        <Icon name="twitter" size="15"></Icon>
        <div class="text-base font-normal leading-lg">{{ $t('info.bindTwitter') }}</div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAccountStore } from '@/store/account'
import { useMineStore } from '@/store/mine'
import { useModalStore } from '@/store/modal'
import { usePopupMessageStore } from '@/store/popup-message'
import Button from '@comp/common/Button.vue'
import InputEmailCode from '@comp/form/InputEmailCode.vue'
import InputWrap from '@comp/form/InputWrap.vue'
import useRequest from '@use/request/index.js'
import { useMultiAuth } from '@use/request/multi-auth'
import { useThirdPartyAuth } from '@use/request/third-party-auth'
import { useYup } from '@use/validator/yup'
import { EMAIL_VALIDATION, SEND_EMAIL_PURPOSE } from '@const'

const { twitterLogin, googleLogin } = useThirdPartyAuth()
const { open: openMessage } = usePopupMessageStore()
const { open } = useModalStore()
const accountStore = useAccountStore()
const { userData } = storeToRefs(accountStore)
const edit = ref(false)
const mineStore = useMineStore()
const { verifyCode } = storeToRefs(mineStore)
const { push } = useRouter()

const { sendEmailCode } = useMultiAuth()
const type = SEND_EMAIL_PURPOSE.VERIFY_EMAIL

const { Yup, parseError, validate } = useYup()
const codeSchema = Yup.string().required().min(6).max(6)

const verifyCodeError = ref('')
const isLoading = ref(false)

const { t: $t } = useI18n()
const credential = reactive({
  email: {
    value: userData.value.email,
    error: '',
    check: false,
    schema: Yup.string().required($t('yup.mixed.required')).email(),
  },
  nickname: {
    value: userData.value.nickname,
    error: '',
    check: false,
    schema: Yup.string().required($t('yup.mixed.required')).max(16),
  },
  username: {
    value: userData.value.username,
    error: '',
    check: false,
    schema: Yup.string().required($t('yup.mixed.required')).min(5).max(30),
  },
})

const confirmEmail = async () => {
  if (edit.value === false) {
    edit.value = true
    nameServerError.value = ''
  } else {
    edit.value = false

    if (userData.value.email !== credential.email.value) {
      modifyMail()
      userData.value.email_validation = EMAIL_VALIDATION.UNVERIFIED
    }
  }
}

const modifyMail = async () => {
  const { execute } = useRequest('User.modifyInfo')
  try {
    await Yup.string().email().required().validate(credential.email.value)
    await execute({
      email: credential.email.value,
    })
    userData.value.email = credential.email.value
    openMessage('title.updateSuccess')
    credential.email.error = ''
  } catch (e) {
    credential.email.error = parseError(e)
    openMessage('title.updateFail')
    edit.value = true
  }
}

const resendEmailCode = computed(() => {
  return () => {
    console.log('你的信箱：', credential.email.value)
    sendEmailCode({ email: credential.email.value, type })
    openMessage('label.sendMailCode')
  }
})
async function validateEmailCode() {
  if (edit.value) {
    openMessage('info.clickRtConfirm')
  } else {
    try {
      isLoading.value = true
      await codeSchema.validate(verifyCode.value)
      await accountValidationEmail()
      verifyCode.value = ''
    } catch (e) {
      verifyCodeError.value = parseError(e)
    } finally {
      isLoading.value = false
    }
  }
}

const serverError = ref('')
async function accountValidationEmail() {
  const { execute: validateEmailCode } = useRequest('Account.validationEmail')
  try {
    await validateEmailCode({
      email: credential.email.value,
      code: verifyCode.value,
    })
    userData.value.email = credential.email.value
    userData.value.email_validation = EMAIL_VALIDATION.VERIFIED
    openMessage('title.submitSuccess')
  } catch (e) {
    serverError.value = e.message
    openMessage('yup.mixed.default')
  }
}

const nameServerError = ref('')
async function saveUserName() {
  const validateNickname = validate(credential.nickname.schema, credential.nickname)
  const validateUsername = validate(credential.username.schema, credential.username)
  await Promise.all([validateNickname, validateUsername])

  const { execute } = useRequest('User.modifyInfo')
  try {
    await execute({
      nickname: credential.nickname.value,
      username: credential.username.value,
    })
    userData.value.nickname = credential.nickname.value
    userData.value.username = credential.username.value
    openMessage('title.updateSuccess')
    push({ name: 'mine-home' })
  } catch (e) {
    nameServerError.value = e.message
    openMessage('title.updateFail')
  }
}

onMounted(() => {
  credential.email.value = userData.value.email
  credential.nickname.value = userData.value.nickname
  credential.username.value = userData.value.username
})
</script>
