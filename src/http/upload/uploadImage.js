import axios from 'axios'
import { ref } from 'vue'
import { useAppStore } from '@/store/app'
import { useModalStore } from '@/store/modal'
import { MODAL_TYPE } from '@const'
import { signData } from './util'

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

export const uploadImageDialog = async (file) => {
  const { open, close } = useModalStore()
  try {
    const progress = ref(0)
    open(MODAL_TYPE.PROGRESS, {
      size: 'sm',
      title: '上傳中',
      content: {
        progress: progress.value,
      },
      showClose: false,
      showConfirm: false,
    })
    return await uploadImage(file, (p) => (progress.value = p * 100))
  } catch (e) {
    console.error(e)
  } finally {
    close()
  }
}
