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
      <div v-if="!edit" class="text-gray-57 text-sm font-normal leading-3">{{ email }}</div>
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
      <Button :loading="isLoading" @click="validate" contrast>{{ $t('label.submit') }}</Button>
      <div v-if="!!serverError" class="text-sm font-normal leading-md text-warning">{{ serverError }}</div>
    </div>
    <InputWrap
      v-model="nickname"
      :label="$t('label.displayName')"
      :placeholder="$t('placeholder.displayName')"
    ></InputWrap>
    <InputWrap
      v-model="username"
      :label="$t('label.account')"
      :sublabel="`@${username}`"
      :placeholder="$t('placeholder.username')"
    ></InputWrap>

    <div>
      <Button @click="saveUserName">{{ $t('common.save') }}</Button>
      <div v-if="!!nameServerError" class="text-sm font-normal leading-md text-warning">{{ nameServerError }}</div>
    </div>

    <div class="mb-20 pt-10 text-center text-base font-normal leading-lg">{{ $t('info.bindThirdPartyLogin') }}</div>
    <div class="flex w-full flex-col items-center space-y-10">
      <div
        class="border-gray-a3 flex w-3/6 cursor-pointer items-center justify-center space-x-10 rounded-full border py-10"
        @click="googleLogin"
      >
        <Icon name="google" size="15"></Icon>
        <div class="text-base font-normal leading-lg">{{ $t('info.bindGoogle') }}</div>
      </div>
      <div
        class="border-gray-a3 flex w-3/6 cursor-pointer items-center justify-center space-x-10 rounded-full border py-10"
        @click="twitterLogin"
      >
        <Icon name="twitter" size="15"></Icon>
        <div class="text-base font-normal leading-lg">{{ $t('info.bindTwitter') }}</div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useAccountStore } from '@/store/account'
import { useMineStore } from '@/store/mine'
import Button from '@comp/common/Button.vue'
import InputEmailCode from '@comp/form/InputEmailCode.vue'
import InputWrap from '@comp/form/InputWrap.vue'
import useRequest from '@use/request/index.js'
import { useMultiAuth } from '@use/request/multi-auth'
import { useThirdPartyAuth } from '@use/request/third-party-auth'
import { useYup } from '@use/validator/yup'
import { EMAIL_VALIDATION, SEND_EMAIL_PURPOSE } from '@const'

const { twitterLogin, googleLogin } = useThirdPartyAuth()

const accountStore = useAccountStore()
const { userData } = accountStore

const edit = ref(false)
const mineStore = useMineStore()
const { email, verifyCode, nickname, username } = storeToRefs(mineStore)

onMounted(() => {
  email.value = userData.email
  nickname.value = userData.nickname
  username.value = userData.username
})

watch(email, (newEmailValue) => {
  if (newEmailValue) {
    email.value = newEmailValue
  }
})

const { sendEmailCode } = useMultiAuth()
const type = SEND_EMAIL_PURPOSE.VERIFY_EMAIL

const { Yup, parseError } = useYup()
const schema = Yup.string().required().min(6).max(6)

const verifyCodeError = ref('')
const isLoading = ref(false)

async function validate() {
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
    console.log('成功囉！')
  } catch (e) {
    serverError.value = e.message
    console.error(e)
  }
}

watch(nickname, (newNicknameValue) => {
  if (newNicknameValue) {
    nickname.value = newNicknameValue
    userData.nickname = nickname.value
    console.log('nickname', nickname.value)
  }
})
watch(username, (newUsernameValue) => {
  if (newUsernameValue) {
    username.value = newUsernameValue
    userData.username = username.value
    console.log('username', username.value)
  }
})

const nameServerError = ref('')
async function saveUserName() {
  const { execute } = useRequest('User.modifyInfo')
  try {
    await execute({
      nickname: nickname.value,
      username: username.value,
    })
    console.log('成功囉！')
  } catch (e) {
    nameServerError.value = e.message
    console.error(e)
  }
}
</script>
