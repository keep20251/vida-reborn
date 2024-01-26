/*
 * 加密圖片本地暫存
 * 已經拿過的就不再發送 request
 * 也不需要再解密一次
 */
import axios from 'axios'
import { DecryptImage } from '@/utils/crypto-data'

const STORE = new Map()

export async function getDecryptDataBlob(url) {
  // 已經有了直接回傳
  if (STORE.has(url)) {
    return await STORE.get(url)
  }

  const promise = getDecryptData(url)

  // 先存下 promise 避免尚未處理完之前又發生相同的 url 被觸發
  STORE.set(url, promise)

  try {
    const decryptedData = await promise

    // 將解密資料蓋掉 promise
    STORE.set(url, decryptedData)
  } catch (e) {
    STORE.delete(url)
    throw e
  }
}

async function getDecryptData(url) {
  // 發送請求
  const res = await axios.get(url, { responseType: 'arraybuffer' })

  const ext = url.substring(url.lastIndexOf('.') + 1)
  const blob = new Blob([res.data])

  // 然後解密
  const decryptedData = await decryptData(blob, ext)

  return decryptedData
}

async function decryptData(blob, ext) {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (t) => {
      const result = t.target.result
      const encryptedBase64 = result.substring(result.indexOf(',') + 1)
      const decryptedBase64 = DecryptImage(encryptedBase64)
      resolve(toBlobUrl(decryptedBase64))
      // resolve(`data:image/${ext};base64,${decryptedBase64}`)
    }
    reader.readAsDataURL(blob)
  })
}

function toBlobUrl(data) {
  const byteChars = atob(data)
  const byteNumbers = new Array(byteChars.length)
  for (let i = 0; i < byteChars.length; i++) {
    byteNumbers[i] = byteChars.charCodeAt(i)
  }
  const byteArray = new Uint8Array(byteNumbers)
  const blob = new Blob([byteArray])
  return URL.createObjectURL(blob)
}
