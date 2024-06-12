// src/http/upload/uploadMultipart.js
import axios, { CanceledError } from 'axios'
import { useLocalStorage } from '@vueuse/core'
import { useAppStore } from '@/store/app'
import { signData } from './util'

const PART_SIZE = 50 * 1024 * 1024
const PART_UPLOAD_FAIL_LIMIT = 3
const UPLOAD_STATUS_CACHE_MS = 175 * 60 * 1000 // 後端說三小時，避免來回有誤差，抓兩小時五十五分
const MULTIPART_UPLOAD_KEY_PREFIX = '__MULTIPART_UPLOAD_'

const PROGRESS_PERCENTAGE_HASH = 0.2
const PROGRESS_PERCENTAGE_UPLOAD = 0.8

export default async function uploadMultipart(file, onProgress, onCancel) {
  // 檔案 hash 和切片
  const { filehash, slices } = await createHashAndSlices(
    file,
    (progress) => onProgress(progress * PROGRESS_PERCENTAGE_HASH, 'label.fileProcess'),
    onCancel,
  )

  console.log('MultipartUpload hash and slice:')
  console.log(`\thash: ${filehash}`)
  console.log(`\tfile size: ${file.size}`)
  console.log(`\tslice count: ${slices.length}`)

  // 取得該檔案目前上傳狀態
  const { sign, timestamp, uploadName, uploadId, uploadUrl, publicUrl, parts, completePart, clear } =
    await uploadStatus(filehash, slices, onCancel)

  console.log('MultipartUpload status:')
  console.log(`\tsign: ${sign}`)
  console.log(`\ttimestamp: ${timestamp}`)
  console.log(`\tuploadName: ${uploadName}`)
  console.log(`\tuploadId: ${uploadId}`)
  console.log(`\tuploadUrl: ${uploadUrl}`)
  console.log(`\tpublicUrl: ${publicUrl}`)
  console.log(`\tsuccess number: ${parts.filter((p) => p.etag).length}`)
  console.log(`\tpending number: ${parts.filter((p) => !p.etag).length}`)

  // 每個切片上傳進度 0~1
  const partsProgress = parts.map(() => 0)

  const uploadPartPromises = parts.map((part, index) =>
    uploadPart({
      part,
      slice: slices[index],
      url: makeUploadUrl(uploadUrl, uploadName, uploadId, part.number, part.signature),
      onProgress: (progress) => {
        partsProgress[index] = progress
        const totalProgress = partsProgress.reduce((a, c) => a + c, 0) / partsProgress.length
        onProgress(PROGRESS_PERCENTAGE_HASH + totalProgress * PROGRESS_PERCENTAGE_UPLOAD, 'label.upload')
      },
      onComplete: (etag) => {
        completePart(index, etag)
        console.log(`MultipartUpload part-${index} complete with etag: ${etag}`)
      },
      onCancel,
    }),
  )

  const completeParts = await Promise.all(uploadPartPromises)
  await merge(sign, timestamp, uploadName, uploadId, completeParts, onCancel)

  console.log('MultipartUpload merge complete')

  clear()

  return { publicUrl, uploadName }
}

/**
 * 對檔案進行切片，並算出 hash
 */
function createHashAndSlices(file, onProgress, onCancel) {
  const slices = []
  let pos = 0
  while (pos < file.size) {
    slices.push(file.slice(pos, pos + PART_SIZE))
    pos += PART_SIZE
  }

  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL('@/workers/hash', import.meta.url), { type: 'module' })
    worker.postMessage({ slices })
    worker.onmessage = (evt) => {
      const { progress, filehash } = evt.data
      if (typeof progress === 'number') {
        onProgress(progress)
      }
      if (filehash) {
        resolve({ filehash, slices })
      }
    }
    onCancel(() => {
      worker.terminate()
      reject(new CanceledError())
    })
  })
}

/**
 * 先對 localStorage 中過期(超過兩小時五十五分)的上傳狀態刪掉
 * 再根據 hash 找出 localStorage 中的上傳狀態資料
 * 沒找到就建立一個新的(呼叫後端 API 建立新的上傳資料)
 */
async function uploadStatus(filehash, slices, onCancel) {
  // 先將過時的上傳狀態刪掉，避免無限累積
  Object.keys(localStorage).forEach((key) => {
    if (
      key.startsWith(MULTIPART_UPLOAD_KEY_PREFIX) &&
      Date.now() - JSON.parse(localStorage.getItem(key)).timestamp > UPLOAD_STATUS_CACHE_MS
    ) {
      localStorage.removeItem(key)
    }
  })

  const uploadStatus = useLocalStorage(`${MULTIPART_UPLOAD_KEY_PREFIX}${filehash}`, {})

  if (Object.keys(uploadStatus.value).length === 0) {
    uploadStatus.value = await createMultipartUpload(slices.length, onCancel)
  }

  return {
    sign: uploadStatus.value.sign,
    timestamp: uploadStatus.value.timestamp,
    uploadName: uploadStatus.value.uploadName,
    uploadId: uploadStatus.value.uploadId,
    uploadUrl: uploadStatus.value.uploadUrl,
    publicUrl: uploadStatus.value.publicUrl,
    parts: uploadStatus.value.parts.map((p) => ({ ...p })),
    completePart: (index, etag) => (uploadStatus.value.parts[index].etag = etag),
    clear: () => (uploadStatus.value = null),
  }
}

/**
 * 向後端取得 MultipartUpload 分段上傳資料
 */
async function createMultipartUpload(partTotal, onCancel) {
  const { appConfig } = useAppStore()
  const { upload_multipart_start: url, upload_mp4_big_key: signKey } = appConfig.config

  const { timestamp, sign } = signData(signKey)
  const data = { sign, timestamp, total: partTotal }

  const controller = new AbortController()
  onCancel(() => controller.abort())

  const {
    uploadUrl,
    UploadName: uploadName,
    publicUrl,
    uploadId,
    slices: parts,
  } = await axios
    .post(url, data, {
      timeout: 500000,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      signal: controller.signal,
    })
    .then(({ data, status }) => {
      if (status === 200 && data.code === 200) {
        return Promise.resolve(data.data)
      } else {
        return Promise.reject(new Error(data))
      }
    })

  return {
    sign,
    timestamp,
    uploadName,
    uploadId,
    uploadUrl,
    publicUrl,
    parts,
  }
}

/**
 * 對切片進行上傳
 * 切片包含 etag 代表已上傳成功
 * 失敗直接重新上傳，最多試 3 次
 */
async function uploadPart({ part, slice, url, onProgress, onComplete, onCancel, count = 0 }) {
  if (part.etag) {
    onProgress(1)
    return { ...part }
  } else {
    const controller = new AbortController()
    onCancel(() => controller.abort())

    const { status, headers } = await axios.put(url, slice, {
      headers: { 'Content-Type': 'application/octet-stream' },
      signal: controller.signal,
      onUploadProgress: (evt) => onProgress(evt.loaded / slice.size),
    })

    if (status === 200) {
      const etag = headers.get('etag').slice(1, -1) // 去頭尾雙引號
      onProgress(1)
      onComplete(etag)
      return { ...part, etag }
    } else if (count < PART_UPLOAD_FAIL_LIMIT) {
      onProgress(0)
      return await uploadPart({ part, slice, url, onProgress, onComplete, onCancel, count: count + 1 })
    } else {
      throw new Error(`Multipart upload fail over ${PART_UPLOAD_FAIL_LIMIT} times at part "${part.number}"`)
    }
  }
}

/**
 * 向後端發送合併切片請求
 */
async function merge(sign, timestamp, upload_name, upload_id, parts, onCancel) {
  const { appConfig } = useAppStore()
  const { upload_multipart_complete: url } = appConfig.config

  const slice_tag = JSON.stringify(parts.map((p) => ({ number: p.number, e_tag: p.etag })))
  const data = { sign, timestamp, upload_name, upload_id, slice_tag }

  console.log(`MultipartUpload merge`)
  console.log(`\tsign: ${sign}`)
  console.log(`\ttimestamp: ${timestamp}`)
  console.log(`\tupload_name: ${upload_name}`)
  console.log(`\tupload_id: ${upload_id}`)
  console.log(`\tslice_tag: ${slice_tag}`)

  const controller = new AbortController()
  onCancel(() => controller.abort())

  return await axios
    .post(url, data, {
      timeout: 500000,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      signal: controller.signal,
    })
    .then(({ data, status }) => {
      if (status === 200 && data.code === 200) {
        const { UploadName: uploadName, publicUrl } = data.data
        return Promise.resolve({ uploadName, publicUrl })
      } else {
        return Promise.reject(new Error(data.data.msg))
      }
    })
}

function makeUploadUrl(template, uploadName, uploadId, number, signature) {
  return template
    .replace('{UploadName}', uploadName)
    .replace('{uploadId}', uploadId)
    .replace('{number}', number)
    .replace('{signature}', signature)
}
