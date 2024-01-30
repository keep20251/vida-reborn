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
import { storeToRefs } from 'pinia'
import { useBecomeCreatorStore } from '@/store/become-creator'
import { useModalStore } from '@/store/modal'
import Button from '@comp/common/Button.vue'
import PhotoContainer from '@comp/mine/PhotoContainer.vue'
import { useYup } from '@use/validator/yup.js'
import { MODAL_TYPE } from '@const'

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

const serverErrorMsg = ref('')

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
    confirmAction: () => {},
    cancelText: $t('common.cancel'),
    cancelAction: () => {},
  })
}

function uploadImage() {}
function send() {}
</script>
