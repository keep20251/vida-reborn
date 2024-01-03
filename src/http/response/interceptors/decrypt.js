import { Decrypt } from '@/utils/crypto-data'
// import { storeToRefs } from 'pinia'
// import { useAccountStore } from '@/store/account'
// import { usePopupDialogStore } from '@/store/popup-dialog'
// import i18n from '@/i18n'

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

    // 未授權
  } else if (processedData.status === 422) {
    // TODO 還沒處理以下的流程，先註解
    // const accountStore = useAccountStore()
    // const { isLogin } = storeToRefs(accountStore)
    // const { logout } = accountStore
    // const { $alert } = usePopupDialogStore()
    // if (isLogin.value) {
    //   $alert({
    //     title: i18n.global.t('common.error'),
    //     content: i18n.global.t('content.tokenExpired'),
    //     confirm: () => {
    //       logout()
    //     },
    //     showClose: false,
    //   }).open()
    // }

    return Promise.reject(new Error(processedData.msg))
  }

  if (import.meta.env.DEV) console.log(`[response]${config.url}`, processedData.data)

  return Promise.resolve(processedData)
}
