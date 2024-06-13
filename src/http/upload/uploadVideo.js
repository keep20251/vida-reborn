import axios from 'axios'
import { useAppStore } from '@/store/app'
import { signData } from './util'

export default function uploadVideo(file, progress) {
  const config = {
    headers: { 'Content-Type': file.type },
    timeout: 60 * 60 * 1000,
  }

  return getUploadResource().then(({ uploadUrl, uploadName, publicUrl }) =>
    uploadChunk(uploadUrl, publicUrl, uploadName, file, config, progress),
  )
}

/**
 * 向上傳伺服器取得 uploadUrl, uploadName, publicUrl
 */
function getUploadResource() {
  const { appConfig } = useAppStore()
  const { upload_mobile_big_mp4_upload: url, upload_mp4_big_key: signKey } = appConfig.config

  const data = signData(signKey)

  return axios
    .post(url, data, {
      timeout: 500000,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((response) => {
      const { data, status } = response
      if (status === 200 && data.code === 200) {
        const { uploadUrl, UploadName: uploadName, publicUrl } = data.data
        return Promise.resolve({
          uploadUrl,
          uploadName,
          publicUrl,
        })
      } else {
        return Promise.reject(new Error(data))
      }
    })
}

// 檔案片段切割大小，-1 不切割
// const CHUNK_SIZE = -1 // 1024 * 1024 * 104
const CHUNK_SIZE = -1 // 1024 * 1024 * 104

/**
 * 片段上傳，內部會遞迴呼叫，直到 offset >= file.size 結束
 *
 * @param {String} uploadUrl 後端提供，用來分批上傳的位址
 * @param {String} publicUrl 後端提供，本次上傳後的檔案位址
 * @param {String} uploadName 後端提供，本次上傳後的檔案名稱
 * @param {*} file https://developer.mozilla.org/en-US/docs/Web/API/File
 * @param {*} config 上傳請求的 config
 * @param {Function} progress 上傳進度通知 0~1
 * @param {Number} offsetStart 片段目前所在位置，預設從 0 開始
 */
function uploadChunk(uploadUrl, publicUrl, uploadName, file, config, progress, offsetStart = 0) {
  return new Promise((resolve, reject) => {
    if (offsetStart >= file.size) {
      console.log(`檔案分批上傳完成: ${publicUrl}`)
      resolve({ publicUrl, uploadName })
    } else {
      const offsetEnd = offsetStart + CHUNK_SIZE < 0 ? file.size : CHUNK_SIZE
      readChunk(file, offsetStart, offsetEnd)
        .then((binary) =>
          axios.put(uploadUrl, binary, {
            ...config,
            onUploadProgress: (evt) => {
              const loaded = offsetStart + evt.loaded
              progress(loaded / file.size)
            },
          }),
        )
        .then(({ status }) => {
          if (status === 200) {
            console.log(`檔案片段[${offsetStart} ~ ${offsetEnd}]上傳完成`)
            uploadChunk(uploadUrl, publicUrl, uploadName, file, config, progress, offsetEnd).then(resolve)
          }
        })
        .catch(reject)
    }
  })
}

/**
 * 檔案片段讀取
 */
function readChunk(file, offsetStart, offsetEnd) {
  return new Promise((resolve, reject) => {
    const freader = new FileReader()
    freader.onload = (evt) => {
      const arrayBuffer = evt.target.result
      const binary = new Uint8Array(arrayBuffer)
      resolve(binary)
    }
    freader.onerror = reject
    freader.readAsArrayBuffer(file.slice(offsetStart, offsetEnd))
  })
}
