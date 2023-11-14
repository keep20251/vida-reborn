import { storeToRefs } from 'pinia'
import { Decrypt } from '@/utils/crypto-data'
import { useAccountStore } from '@/store/account'
import { usePopupDialogStore } from '@/store/popup-dialog'
import i18n from '@/i18n'

export default function (response) {
  // 是一個 Promise 物件的話不處理
  if (typeof response === 'object' && typeof response.then === 'function' && typeof response.catch === 'function') {
    return response
  }

  const { data, status, config, headers, request, statusText } = response
  const decryptData = Decrypt(data.data)

  // 错误处理
  if (decryptData.status === 0) {
    return Promise.reject(new Error(decryptData.msg))

    // 未授權
  } else if (decryptData.status === 422) {
    const accountStore = useAccountStore()
    const { isLogin } = storeToRefs(accountStore)
    const { logout } = accountStore
    const { $alert } = usePopupDialogStore()
    if (isLogin.value) {
      $alert({
        title: i18n.global.t('common.error'),
        content: i18n.global.t('content.tokenExpired'),
        confirm: () => {
          logout()
        },
        showClose: false,
      }).open()
    }

    return Promise.reject(new Error(decryptData.msg))
  }

  if (import.meta.env.DEV) console.log(`[response]${config.url}`, decryptData.data)

  return Promise.resolve(decryptData.data)
}
