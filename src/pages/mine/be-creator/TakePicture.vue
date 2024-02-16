<template>
  <div class="flex w-full flex-col space-y-30">
    <PhotoContainer
      :title="$t('beCreator.title.id')"
      :picture-info="$t('beCreator.content.minePic')"
      :button-text="$t('beCreator.btn.takePicId')"
      :err-msg="validator.idPhotoData.error"
      @change:file="
        (file) => {
          idPhotoData = file
          validator.idPhotoData.error = ''
        }
      "
    ></PhotoContainer>
    <PhotoContainer
      :title="$t('beCreator.title.face')"
      :picture-info="$t('beCreator.content.minePic')"
      :button-text="$t('beCreator.btn.takePicFace')"
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
      <div class="mb-10 text-center text-base font-normal leading-md">
        {{ $t('beCreator.content.sendAfterConfirmPic') }}
      </div>
      <Button @click="validate">{{ $t('beCreator.btn.submit') }}</Button>
      <div v-if="serverErrorMsg" class="text-warning">
        {{ serverErrorMsg }}
      </div>
    </div>
  </div>
</template>
<script setup>
import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useAccountStore } from '@/store/account'
import { useBecomeCreatorStore } from '@/store/become-creator'
import { useModalStore } from '@/store/modal'
import Button from '@comp/common/Button.vue'
import PhotoContainer from '@comp/mine/PhotoContainer.vue'
import useRequest from '@use/request'
import { useRouters } from '@use/routers'
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
    title: $t('beCreator.title.reConfirm'),
    size: 'sm',
    content: $t('beCreator.content.confirmSend'),
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

const { to } = useRouters()
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
      title: $t('beCreator.title.submitSuccess'),
      size: 'sm',
      content: $t('beCreator.content.submitSuccess'),
      confirmText: $t('common.confirm'),
      confirmAction: () => to('mine-home'),
    })
  } catch (e) {
    console.error(e)
    serverErrorMsg.value = e.message
    open(MODAL_TYPE.CONFIRM, {
      title: $t('beCreator.title.submitFailed'),
      size: 'sm',
      content: e.message,
      confirmText: $t('common.confirm'),
      confirmAction: () => to('mine-home'),
    })
  }
}
</script>
