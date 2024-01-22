import { Encrypt } from '@/utils/crypto-data'

const seralizeOrdered = function (params, splitStr = '&') {
  let client
  let timestamp
  let data
  let sign
  for (const i in params) {
    const key = i
    const value = params[i]
    if (i === 'timestamp') {
      timestamp = `${key}=${value}`
    } else if (i === 'data') {
      data = `${key}=${value}`
    } else if (i === 'sign') {
      sign = `${key}=${value}`
    } else {
      client = `${key}=${value}`
    }
  }
  return client + splitStr + timestamp + splitStr + data + splitStr + sign
}

export default function (request) {
  console.log(`[request]${request.url}`, request.data)

  if (import.meta.env.DEV) return request

  if (request.data) {
    request.data = seralizeOrdered(
      Encrypt({
        ...request.data,
      }),
    )
  }

  return request
}
