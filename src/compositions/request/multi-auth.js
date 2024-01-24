import useRequest from './index'
import { SEND_EMAIL_PURPOSE } from '@const'

/**
 * 因目前Vida的登入方式有很多種，
 * 有的是用帳號密碼，有的是用手機號碼，有的是用Email，
 * 電子郵件的驗證碼用途也很多，
 * 所以這裡統一管理會用到的一些方法，
 */
export function useMultiAuth() {
  /**
   * 發送電子郵件驗證碼
   * type:
   *  1 綁定手機
   *  2 解綁手機
   *  3 找回帳號
   *  4 驗證信箱
   *  5 快速登入
   */
  async function sendEmailCode({ email, type = SEND_EMAIL_PURPOSE.FAST_LOGIN } = {}) {
    const { execute, data } = useRequest('Account.sendEmailCode')
    await execute({ email, type })
    console.log('sendEmailCode.data', data)
    return data
  }

  return { sendEmailCode }
}
