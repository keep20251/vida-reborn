import axios from 'axios'
import { useAppStore } from '@/store/app'
import { signData } from './util'
import { ref } from 'vue'
import { usePopupDialogStore } from '@/store/popup-dialog'
import { POPUP_DIALOG_TYPE } from '@const'
import { useI18n } from 'vue-i18n'

export default function uploadImage(file, progress) {
  const { appConfig } = useAppStore()
  const { img_upload_url: url, upload_img_key: signKey } = appConfig.config

  const data = signData(signKey, { cover: file })

  return axios
    .post(url, data, {
      timeout: 500000,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (evt) => {
        progress(evt.loaded / evt.total)
      },
    })
    .then((response) => {
      const { code, msg } = response.data
      if (code === 1) {
        return Promise.resolve(msg)
      } else {
        return Promise.reject(new Error(msg))
      }
    })
}

export const upload = async (file) => {
  const { t: $t } = useI18n()
  const { $popupDialog, close } = usePopupDialogStore()
  try {
    const progressTmp = ref(0)
    $popupDialog(POPUP_DIALOG_TYPE.PROGRESS, {
      title: $t('label.upload'),
      content: {
        progress: progressTmp,
        size: 50,
      },
      showConfirm: false,
      showClose: false,
    }).open()
    return await uploadImage(file, (progress) => (progressTmp.value = progress * 100))
  } catch (e) {
    console.error(e)
  } finally {
    close()
  }
}
