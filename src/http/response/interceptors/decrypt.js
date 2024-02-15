import { Decrypt } from '@/utils/crypto-data'
import TokenInvalidError from '@/errors/TokenInvalidError'

export default function (response) {
  // 是一個 Promise 物件的話不處理
  if (typeof response === 'object' && typeof response.then === 'function' && typeof response.catch === 'function') {
    return response
  }

  const { data, status, config, headers, request, statusText, crypt } = response
  const processedData = crypt ? Decrypt(data.data) : data

  // 错误处理
  if (processedData.status === 0) {
    return Promise.reject(new Error(processedData.msg))
  }

  // 未授權
  else if (processedData.status === 422) {
    return Promise.reject(new TokenInvalidError(processedData.msg))
  }

  if (import.meta.env.DEV) console.log(`[response]${config.url}`, processedData.data)

  return Promise.resolve(processedData)
}
