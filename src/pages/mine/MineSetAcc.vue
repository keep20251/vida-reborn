<template>
  <div class="grid space-y-20 border-t pt-20">
    <div class="flex flex-col space-y-10">
      <div class="flex justify-between">
        <div
          class="flex items-center space-x-10"
          :class="[{ 'w-full justify-between': userData.email_validation === EMAIL_VALIDATION.VERIFIED }]"
        >
          <div class="text-base font-normal leading-lg">{{ $t('label.nowEmail') }}</div>
          <div
            class="text-sm font-normal leading-3"
            :class="[
              {
                'text-warning': userData.email_validation === EMAIL_VALIDATION.UNVERIFIED,
                'text-primary': userData.email_validation === EMAIL_VALIDATION.VERIFIED,
              },
            ]"
          >
            {{
              userData.email_validation === EMAIL_VALIDATION.UNVERIFIED ? $t('label.unverified') : $t('label.verified')
            }}
          </div>
        </div>
        <div
          v-if="userData.email_validation === EMAIL_VALIDATION.UNVERIFIED"
          class="cursor-pointer text-base font-normal leading-lg text-primary"
          @click="() => (edit = !edit)"
        >
          {{ edit ? 'Confirm' : 'Edit' }}
        </div>
      </div>
      <InputWrap v-if="edit" v-model="email" :placeholder="$t('placeholder.email')"></InputWrap>
      <div v-if="!edit" class="text-sm font-normal leading-3 text-gray-57">{{ email }}</div>
    </div>
    <InputEmailCode
      v-if="userData.email_validation === EMAIL_VALIDATION.UNVERIFIED"
      v-model="verifyCode"
      :onResend="() => sendEmailCode({ email, type })"
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
import { onMounted, reactive, ref, watch } from 'vue'
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
const { email, verifyCode } = storeToRefs(mineStore)
const { push } = useRouter()

onMounted(() => {
  email.value = userData.email
  credential.nickname.value = userData.value.nickname
  credential.username.value = userData.value.username
})

watch(email, (newEmailValue) => {
  if (newEmailValue) {
    email.value = newEmailValue
  }
})

const { sendEmailCode } = useMultiAuth()
const type = SEND_EMAIL_PURPOSE.VERIFY_EMAIL

const { Yup, parseError, validate } = useYup()
const schema = Yup.string().required().min(6).max(6)

const verifyCodeError = ref('')
const isLoading = ref(false)

async function validateEmailCode() {
  try {
    isLoading.value = true
    await schema.validate(verifyCode.value)
    await accountValidationEmail()
  } catch (e) {
    verifyCodeError.value = parseError(e)
  } finally {
    isLoading.value = false
  }
}

const serverError = ref('')
async function accountValidationEmail() {
  const { execute } = useRequest('Account.validationEmail')
  try {
    await execute({
      email: email.value,
      code: verifyCode.value,
    })
    openMessage('title.updateSuccess')
  } catch (e) {
    serverError.value = e.message
    openMessage('title.updateFail')
  }
}

const { t: $t } = useI18n()
const credential = reactive({
  nickname: {
    value: userData.nickname,
    error: '',
    check: false,
    schema: Yup.string().required($t('yup.mixed.required')).max(16),
  },
  username: {
    value: userData.username,
    error: '',
    check: false,
    schema: Yup.string().required($t('yup.mixed.required')).min(5).max(30),
  },
})

watch(credential.nickname.value, (newNicknameValue) => {
  if (newNicknameValue) {
    userData.nickname = newNicknameValue
    console.log('nickname', newNicknameValue)
  }
})
watch(credential.username.value, (newUsernameValue) => {
  if (newUsernameValue) {
    userData.username = newUsernameValue
    console.log('username', newUsernameValue)
  }
})

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
</script>
