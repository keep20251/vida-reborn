import { ref, shallowRef, readonly } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { useCookie } from '@use/utils/cookie'
import { COOKIE_KEY } from '@const'
import API from '@/http'

export default useRequest

/**
 * 有兩種使用情境
 *
 * 1. 立即執行
 *    immediate 需設為 true，此時在調用 useRequest 之後會馬上執行請求
 *    onSuccess, onError, onFinish 回呼函式會在對應時間被調用
 *
 *    ex: useRequest('module.name', {
 *          immediate: true,
 *          params: { ... }
 *          onSuccess(data) { // 處理請求收到的資料 },
 *          onError(e) { // 處理請求時發生的錯誤 },
 *          onFinish() { // 處理請求完成後續事項 },
 *        })
 *
 *    你也可以在回呼函式裡直接使用 useRequest 回傳的響應性資料(data, error, isLoading, isFinished, isCanceled)
 *    而不直接使用回呼函式的參數
 *    因為當回呼函式被呼叫的時候這些響應性資料都已經被設為對應的結果了
 *
 *    此情境無法得到 execute 函式自行執行請求
 *    僅在宣告 useRequest 當下立即執行一次
 *
 * 2. 延遲執行(預設)
 *    首先宣告一個請求
 *    const { data, error, isLoading, isFinished, isCanceled, execute, cancel } = useRequest('module.name')
 *
 *    然後在對應的時間點執行他(execute)
 *    onSuccess, onError, onFinish 不會在此執行時被觸發
 *    你必須在你自己調用 execute 的過程中自己處理
 *    如以下兩種方式
 *
 *    1. await 模式
 *    try {
 *      await execute({ ...params })
 *      // 處理請求收到的資料(data.value)
 *    } catch () {
 *      // 處理請求時發生的錯誤(error.value)
 *    } finally {
 *      // 處理請求完成後續事項
 *    }
 *
 *    2. promise 模式
 *    execute({ ...params })
 *      .then(() => { // 處理請求收到的資料(data.value) })
 *      .catch(() => { // 處理請求時發生的錯誤(error.value) })
 *      .finally(() => { // 處理請求完成後續事項 })
 *
 *    此情境下 execute 可以被多次調用
 *    每次調用後所有對應的響應性資料都會改變
 *
 * @param {*} apiKey {module_name}.{api_name}
 * @param {*} param1 optinos
 * @returns
 */
function useRequest(
  apiKey,
  { params = {}, immediate = false, shallow = true, initialData = null, onSuccess, onError, onFinish } = {},
) {
  const guestIdCookie = useCookie(COOKIE_KEY.GUEST_ID, { default: uuidv4(), readonly: true })
  const tokenCookie = useCookie(COOKIE_KEY.AUTH, { default: '' })

  const data = (shallow ? shallowRef : ref)(initialData)
  const error = shallowRef(null)
  const isLoading = ref(false)
  const isFinished = ref(false)
  const isCanceled = ref(false)

  const [moduleName, fnName] = apiKey.split('.')
  const controller = new AbortController()

  async function execute(execParams) {
    cancel()

    error.value = null
    isLoading.value = true
    isFinished.value = false
    isCanceled.value = false

    const reqParams = execParams ? { ...execParams } : { ...params }

    // 開發模式下需要給debug key才能啟用後端API的debug模式
    if (import.meta.env.DEV) {
      reqParams.debug = 'VjTdTfVx1kEyr4IV'
    }

    // 塞 oauth
    reqParams.oauth_id = guestIdCookie.value
    reqParams.oauth_type = 'pwa'

    // 塞 token
    if (tokenCookie.value) {
      reqParams.token = tokenCookie.value
    }

    return API[moduleName][fnName](
      { data: reqParams },
      {
        signal: controller.signal,
      },
    )
      .then((resData) => {
        if (isCanceled.value) return
        data.value = resData.data
        immediate && onSuccess && onSuccess(resData.data)
        return resData.data
      })
      .catch((e) => {
        if (isCanceled.value) return
        error.value = e
        immediate && onError && onError(e)
        throw e
      })
      .finally(() => {
        if (isCanceled.value) return
        isLoading.value = false
        isFinished.value = true
        immediate && onFinish && onFinish()
      })
  }

  function cancel() {
    if (!isLoading.value || isFinished.value) return

    controller.abort()
    isLoading.value = false
    isFinished.value = false
    isCanceled.value = true
  }

  const r = {
    data: readonly(data),
    error: readonly(error),
    isLoading: readonly(isLoading),
    isFinished: readonly(isFinished),
    isCanceled: readonly(isCanceled),
    cancel,
  }

  if (immediate) {
    execute()
  } else {
    r.execute = execute
  }

  return r
}
