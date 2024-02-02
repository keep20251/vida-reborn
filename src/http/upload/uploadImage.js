import axios from 'axios'
import { useAppStore } from '@/store/app'
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
