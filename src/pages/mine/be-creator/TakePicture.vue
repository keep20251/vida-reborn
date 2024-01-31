<template>
  <div class="flex w-full flex-col space-y-30">
    <PhotoContainer
      title="1. 证件资讯正面照片"
      picture-info="My Picture"
      button-text="開始拍攝【證件資訊正面照片】"
      :err-msg="validator.idPhotoData.error"
      @change:file="
        (file) => {
          idPhotoData = file
          validator.idPhotoData.error = ''
        }
      "
    ></PhotoContainer>
    <PhotoContainer
      title="2. 用户脸部与证件资讯正面照片"
      picture-info="My Picture"
      button-text="开始拍摄【用户脸部与证件资讯正面照片】"
      :err-msg="validator.facePhotoData.error"
      @change:file="
        (file) => {
          facePhotoData = file
          validator.facePhotoData.error = ''
        }
      "
    ></PhotoContainer>
    <div v-if="validator.identity.error">{{ $t(validator.identity.error) }}</div>
    <div v-if="validator.country.error">{{ $t(validator.country.error) }}</div>
    <div>
      <div class="mb-10 text-center text-base font-normal leading-md">确认照片后送出资料</div>
      <Button @click="validate">送出申請資料</Button>
      <div v-if="errorMsg" class=""></div>
    </div>
  </div>
</template>
<script setup>
import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAccountStore } from '@/store/account'
import { useBecomeCreatorStore } from '@/store/become-creator'
import { useModalStore } from '@/store/modal'
import Button from '@comp/common/Button.vue'
import PhotoContainer from '@comp/mine/PhotoContainer.vue'
import useRequest from '@use/request'
import { useYup } from '@use/validator/yup.js'
import { AUTH_STATUS, MODAL_TYPE } from '@const'
import uploadImage from '@/http/upload/uploadImage'

const { t: $t } = useI18n()
const { open } = useModalStore()

const idPhotoData = ref(null)
const facePhotoData = ref(null)

const { identity, country } = storeToRefs(useBecomeCreatorStore())

const { Yup, validatePure } = useYup()
const schemaIdentity = Yup.number().required()
const schemaCountry = Yup.string().required()
const schemaIdPhoto = Yup.mixed().required({ key: 'yup.file.required' })
const schemaFacePhoto = Yup.mixed().required({ key: 'yup.file.required' })

const validator = reactive({
  identity: { check: false, error: '' },
  country: { check: false, error: '' },
  idPhotoData: { check: false, error: '' },
  facePhotoData: { check: false, error: '' },
})

async function validate() {
  try {
    await Promise.all([
      validatePure(schemaIdentity, identity.value, validator.identity),
      validatePure(schemaCountry, country.value, validator.country),
      validatePure(schemaIdPhoto, idPhotoData.value, validator.idPhotoData),
      validatePure(schemaFacePhoto, facePhotoData.value, validator.facePhotoData),
    ])

    if (Object.values(validator).some((v) => v.check === false)) return
    openConfirm()
  } catch (e) {
    console.error(e)
  }
}

function openConfirm() {
  open(MODAL_TYPE.CONFIRM, {
    title: '再次確認',
    size: 'sm',
    content: '请问您是否确认要送出资料？',
    confirmText: $t('common.confirm'),
    confirmAction: uploadPicture,
    cancelText: $t('common.cancel'),
    cancelAction: () => {},
  })
}

const idPhotoUrl = ref('')
const facePhotoUrl = ref('')
const serverErrorMsg = ref('')

async function uploadPicture() {
  try {
    idPhotoUrl.value = await uploadImage(idPhotoData.value, () => {})
    facePhotoUrl.value = await uploadImage(facePhotoData.value, () => {})
    submit()
  } catch (e) {
    console.error(e)
    serverErrorMsg.value = e.message
  }
}

const router = useRouter()
const { userData } = storeToRefs(useAccountStore())

async function submit() {
  const { execute } = useRequest('User.applyCreator')

  try {
    const payload = {
      country: country.value,
      identify: identity.value,
      url: `${idPhotoUrl.value},${facePhotoUrl.value}`,
    }
    await execute(payload)
    userData.value.auth_status = AUTH_STATUS.VERIFIED

    open(MODAL_TYPE.CONFIRM, {
      title: '提出申请成功',
      size: 'sm',
      content: '太棒了！相关资料已成功送出，我们将会在七天内尽快完成您的审核，结果将以信息的方式通知您。感谢您的耐心！',
      confirmText: $t('common.confirm'),
      confirmAction: () => router.push({ name: 'mine-home' }),
    })
  } catch (e) {
    console.error(e)
    serverErrorMsg.value = e.message
    open(MODAL_TYPE.CONFIRM, {
      title: '提出申请失敗',
      size: 'sm',
      content: e.message,
      confirmText: $t('common.confirm'),
      confirmAction: () => router.push({ name: 'mine-home' }),
    })
  }
}
</script>
