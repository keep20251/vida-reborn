import md5 from 'md5'

export function signData(signKey, data) {
  const timestamp = +new Date()
  const result = {
    ...data,
    timestamp,
    sign: md5(`${timestamp}${signKey}`),
  }

  return result
}
