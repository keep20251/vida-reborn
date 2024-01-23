import { ref, shallowRef, readonly } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { useCookie } from '@use/utils/cookie'
import { useLocaleReadonly } from '@use/utils/localeReadonly'
import { COOKIE_KEY } from '@const'
import API from '@/http'

export default useRequest

/**
 * 有兩種使用情境
 *
 * 1. 立即執行
 *    immediate 需設為 true
 *    此時在調用 useRequest 之後會馬上執行請求，並直接回傳該請求的 Promise 物件
 *    你就可以用以下兩種方式處理
 *
 *    1. await 模式
 *    try {
 *      const data = await useRequest('module.name', { params: { ... }, immediate: true })
 *      // 處理請求收到的資料(data)
 *    } catch (e) {
 *      // 處理請求時發生的錯誤(e)
 *    } finally {
 *      // 處理請求完成後續事項
 *    }
 *
 *    2. promise 模式
 *    useRequest('module.name', { params: { ... }, immediate: true })
 *      .then((data) => { // 處理請求收到的資料(data) })
 *      .catch((e) => { // 處理請求時發生的錯誤(e) })
 *      .finally(() => { // 處理請求完成後續事項 })
 *
 *    此情境無法得到 execute 函式在未來多次執行請求
 *    僅在宣告 useRequest 當下立即執行一次並回傳執行後的 Promise 物件
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
function useRequest(apiKey, { params = {}, immediate = false, shallow = true, initialData = null } = {}) {
  const guestIdCookie = useCookie(COOKIE_KEY.GUEST_ID, { default: uuidv4, readonly: true })
  const tokenCookie = useCookie(COOKIE_KEY.AUTH, { default: '' })

  const data = (shallow ? shallowRef : ref)(initialData)
  const error = shallowRef(null)
  const isLoading = ref(false)
  const isFinished = ref(false)
  const isCanceled = ref(false)

  const [moduleName, fnName] = apiKey.split('.')
  const controller = new AbortController()

  function execute(execParams) {
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

    return API[moduleName][fnName]({
      data: reqParams,
      config: {
        headers: {
          'Accept-Language': useLocaleReadonly().value,
        },
        signal: controller.signal,
      },
    })
      .then((resData) => {
        if (isCanceled.value) return
        data.value = resData.data
        return resData.data
      })
      .catch((e) => {
        if (isCanceled.value) return
        error.value = e
        throw e
      })
      .finally(() => {
        if (isCanceled.value) return
        isLoading.value = false
        isFinished.value = true
      })
  }

  function cancel() {
    if (!isLoading.value || isFinished.value) return

    controller.abort()
    isLoading.value = false
    isFinished.value = false
    isCanceled.value = true
  }

  if (immediate) {
    return execute()
  } else {
    return {
      data: readonly(data),
      error: readonly(error),
      isLoading: readonly(isLoading),
      isFinished: readonly(isFinished),
      isCanceled: readonly(isCanceled),
      execute,
      cancel,
    }
  }
}
