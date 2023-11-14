/*
 * 加密圖片本地暫存
 * 已經拿過的就不再發送 request
 * 也不需要再解密一次
 */
import axios from 'axios'
import { DecryptImage } from '@/utils/crypto-data'

const STORE = new Map()

export async function getDecryptDataUrl(url) {
  // 已經有了直接回傳
  if (STORE.has(url)) {
    return STORE.get(url)
  }

  // 沒有馬上發送請求
  const res = await axios.get(url, { responseType: 'arraybuffer' })

  const ext = url.substring(url.lastIndexOf('.') + 1)
  const blob = new Blob([res.data])

  // 然後解密
  const decryptedData = await decryptData(blob, ext)

  // 再存下來
  STORE.set(url, decryptedData)

  return decryptedData
}

async function decryptData(blob, ext) {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (t) => {
      const result = t.target.result
      const encryptedBase64 = result.substring(result.indexOf(',') + 1)
      const decryptedBase64 = DecryptImage(encryptedBase64)
      resolve(`data:image/${ext};base64,${decryptedBase64}`)
    }
    reader.readAsDataURL(blob)
  })
}
