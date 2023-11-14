/* eslint-disable */

import CryptoJS from 'crypto-js'
import sha256 from 'sha256'
import md5 from 'md5'

const appkey =
  '84_54_109_122_56_114_84_70_48_87_88_118_106_78_68_103_115_104_122_83_75_116_101_75_89_112_71_112_97_69_50_86'
    .split('_')
    .map((a) => String.fromCharCode(parseInt(a)))
    .join('')

const key = CryptoJS.enc.Utf8.parse('oaCIYzQ5gbaRj7F5')
const iv = CryptoJS.enc.Utf8.parse('3729Bw6OOrOWt7E9')

const media_key = CryptoJS[String.fromCharCode(101) + String.fromCharCode(110) + String.fromCharCode(99)][
  String.fromCharCode(85) + String.fromCharCode(116) + String.fromCharCode(102) + String.fromCharCode(56)
][`${String.fromCharCode(112)}arse`](
  '102_53_100_57_54_53_100_102_55_53_51_51_54_50_55_48'
    .split('_')
    .map((a) => String.fromCharCode(parseInt(a)))
    .join(''),
)
const media_iv = CryptoJS[String.fromCharCode(101) + String.fromCharCode(110) + String.fromCharCode(99)][
  String.fromCharCode(85) + String.fromCharCode(116) + String.fromCharCode(102) + String.fromCharCode(56)
][`${String.fromCharCode(112)}arse`](
  '57_55_98_54_48_51_57_52_97_98_99_50_102_98_101_49'
    .split('_')
    .map((a) => String.fromCharCode(parseInt(a)))
    .join(''),
)

//签名算法
function getSign(obj) {
  const keyValues = []
  if (typeof obj.data !== 'undefined') {
    keyValues.push(`client=${obj.client}`)
  }
  if (typeof obj.data !== 'undefined') {
    keyValues.push(`data=${obj.data}`)
  }
  if (typeof obj.errcode !== 'undefined') {
    keyValues.push(`errcode=${obj.errcode}`)
  }
  if (typeof obj.timestamp !== 'undefined') {
    keyValues.push(`timestamp=${obj.timestamp}`)
  }
  const text = keyValues.join('&') + appkey
  const sha256Text = sha256(text)
  const md5Text = md5(sha256Text)
  return md5Text
}

export function DecryptImage(word) {
  const decrypt = CryptoJS[String.fromCharCode(65) + String.fromCharCode(69) + String.fromCharCode(83)][
    '100_101_99_114_121_112_116'
      .split('_')
      .map((a) => String.fromCharCode(parseInt(a)))
      .join('')
  ](word, media_key, {
    iv: media_iv,
    mode: CryptoJS[
      '109_111_100_101'
        .split('_')
        .map((a) => String.fromCharCode(parseInt(a)))
        .join('')
    ][String.fromCharCode(67) + String.fromCharCode(66) + String.fromCharCode(67)],
    padding: CryptoJS[`${String.fromCharCode(112)}ad`][`${String.fromCharCode(78)}o${String.fromCharCode(80)}adding`],
  })
  const decryptedStr = decrypt.toString(CryptoJS.enc.Base64)
  return decryptedStr
}

export function DecryptVideo(word) {
  const decrypt = CryptoJS[String.fromCharCode(65) + String.fromCharCode(69) + String.fromCharCode(83)][
    '100_101_99_114_121_112_116'
      .split('_')
      .map((a) => String.fromCharCode(parseInt(a)))
      .join('')
  ](word, media_key, {
    iv: media_iv,
    mode: CryptoJS[
      '109_111_100_101'
        .split('_')
        .map((a) => String.fromCharCode(parseInt(a)))
        .join('')
    ][String.fromCharCode(67) + String.fromCharCode(66) + String.fromCharCode(67)],
    padding: CryptoJS[`${String.fromCharCode(112)}ad`].Pkcs7,
  })
  const decryptedStr = decrypt.toString(
    CryptoJS[String.fromCharCode(101) + String.fromCharCode(110) + String.fromCharCode(99)][
      String.fromCharCode(85) + String.fromCharCode(116) + String.fromCharCode(102) + String.fromCharCode(56)
    ],
  )
  return decryptedStr
}

//加密方法
export function Encrypt(word) {
  // 问题二. 参数如为对象类型, 前转为字符串类型(xifeng update)
  if (typeof word == 'object') {
    word = JSON.stringify(word)
  }

  let srcs = CryptoJS.enc.Utf8.parse(word)
  let encrypted = CryptoJS.AES.encrypt(srcs, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 })
  let data = CryptoJS.enc.Base64.stringify(encrypted.ciphertext)
  const unix_t = new Date().getTime() / 1000
  const timestamp = parseInt(unix_t.toString())
  const sign = getSign({ client: 'pwa', data, timestamp })
  return { client: 'pwa', sign, timestamp, data }
}

//解密方法
export function Decrypt(word) {
  let encryptedHexStr = CryptoJS.enc.Base64.parse(word)
  let srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr)
  let decrypt = CryptoJS.AES.decrypt(srcs, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 })
  let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8)
  return JSON.parse(decryptedStr.toString())
}

// IM密钥
const im_key = CryptoJS.enc.Utf8.parse('Ksl5I9PXK63EdiJh')
const im_iv = CryptoJS.enc.Utf8.parse('fyMqKuq1a4n0PJwf')

// IM解密
export function DecryptIm(word) {
  const encryptedHexStr = CryptoJS.enc.Base64.parse(word)
  const srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr)
  const decrypt = CryptoJS.AES.decrypt(srcs, im_key, {
    iv: im_iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  })
  const decryptedStr = decrypt.toString(CryptoJS.enc.Utf8)
  return JSON.parse(decryptedStr.toString())
}

// IM加密
export function EncryptIm(word) {
  if (typeof word == 'object' && word !== null) word = JSON.stringify(word)
  const srcs = CryptoJS.enc.Utf8.parse(word)
  const encrypted = CryptoJS.AES.encrypt(srcs, im_key, {
    iv: im_iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  })
  let data = CryptoJS.enc.Base64.stringify(encrypted.ciphertext)
  return data
}
