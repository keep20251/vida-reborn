<template>
  <div class="grid space-y-20 border-t pt-20">
    <div class="flex flex-col space-y-10">
      <div class="flex justify-between">
        <div
          class="flex items-center space-x-10"
          :class="[{ 'w-full justify-between': userData.email_validation === EMAIL_VALIDATION.VERIFIED }]"
        >
          <div class="leading-lg text-base font-normal">目前的邮箱</div>
          <div
            class="text-sm font-normal leading-3"
            :class="[
              {
                'text-warning': userData.email_validation === EMAIL_VALIDATION.UNVERIFIED,
                'text-primary': userData.email_validation === EMAIL_VALIDATION.VERIFIED,
              },
            ]"
          >
            {{ userData.email_validation === EMAIL_VALIDATION.UNVERIFIED ? '尚未验证' : '已验证通過' }}
          </div>
        </div>
        <div
          v-if="userData.email_validation === EMAIL_VALIDATION.UNVERIFIED"
          class="leading-lg cursor-pointer text-base font-normal text-primary"
          @click="() => (edit = !edit)"
        >
          {{ edit ? 'Confirm' : 'Edit' }}
        </div>
      </div>
      <InputWrap v-if="edit" v-model="email" :placeholder="'请输入邮箱'"></InputWrap>
      <div v-if="!edit" class="text-sm font-normal leading-3 text-gray66">{{ email }}</div>
    </div>
    <InputEmailCode
      v-if="userData.email_validation === EMAIL_VALIDATION.UNVERIFIED"
      v-model="verifyCode"
      :onResend="() => sendEmailCode({ email, type })"
      :err-msg="verifyCodeError"
      :first-time="false"
      :label-center="false"
      @update:modelValue="verifyCodeError = ''"
      @error="(message) => (serverError = message)"
    ></InputEmailCode>
    <div class="grid space-y-5" v-if="userData.email_validation === EMAIL_VALIDATION.UNVERIFIED">
      <Button :loading="isLoading" @click="validate" contrast>提交验证</Button>
      <div v-if="!!serverError" class="leading-md text-sm font-normal text-warning">{{ serverError }}</div>
    </div>
    <InputWrap v-model="nickname" :label="'显示名称'" :placeholder="'请输入显示名称'"></InputWrap>
    <InputWrap
      v-model="username"
      :label="'用户名'"
      :sublabel="`@${username}`"
      :placeholder="'请输入用户名'"
    ></InputWrap>

    <div>
      <Button @click="saveUserName">保存</Button>
      <div v-if="!!nameServerError" class="leading-md text-sm font-normal text-warning">{{ nameServerError }}</div>
    </div>

    <div class="leading-lg mb-20 pt-10 text-center text-base font-normal">绑定第三方登入</div>
    <div class="flex w-full flex-col items-center space-y-10">
      <div
        class="flex w-3/6 cursor-pointer items-center justify-center space-x-10 rounded-full border border-gray30 py-10"
      >
        <Icon name="google" size="15"></Icon>
        <div class="leading-lg text-base font-normal">与 Google 绑定</div>
      </div>
      <div
        class="flex w-3/6 cursor-pointer items-center justify-center space-x-10 rounded-full border border-gray30 py-10"
      >
        <Icon name="facebook" size="15"></Icon>
        <div class="leading-lg text-base font-normal">与 Facebook 绑定</div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { onMounted, ref, watch } from 'vue'
import InputWrap from '@comp/form/InputWrap.vue'
import Button from '@comp/common/Button.vue'
import { storeToRefs } from 'pinia'
import { useMineStore } from '@/store/mine'
import { useMultiAuth } from '@/compositions/request/multi-auth'
import { useYup } from '@use/validator/yup'
import InputEmailCode from '@/components/form/InputEmailCode.vue'
import { SEND_EMAIL_PURPOSE, EMAIL_VALIDATION } from '@/constant'
import useRequest from '@use/request/index.js'
import { useAccountStore } from '@/store/account'

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
  const { execute } = useRequest('Account.validationEmail', {})
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
    console.log('nickname', nickname.value)
  }
})
watch(username, (newUsernameValue) => {
  if (newUsernameValue) {
    username.value = newUsernameValue
    console.log('username', username.value)
  }
})

const nameServerError = ref('')
async function saveUserName() {
  const { execute } = useRequest('User.modifyInfo', {})
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
