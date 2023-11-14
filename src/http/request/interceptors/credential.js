import { storeToRefs } from 'pinia'
import { useAccountStore } from '@/store/account'

/**
 * 需要登入權限的請求必須補上 token
 */
export default function (request) {
  const { isLogin, token } = storeToRefs(useAccountStore())

  if (isLogin.value) {
    request.data.token = token.value
  }

  return request
}
