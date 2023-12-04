import { ref, shallowRef, readonly, useSSRContext } from 'vue'
import { useCookies, createCookies } from '@vueuse/integrations/useCookies'
import { v4 as uuidv4 } from 'uuid'
import { COOKIE_KEY } from '@const'
import API from '@/http'

export default useRequest

function useRequest(
  apiKey,
  { params = {}, immediate = false, shallow = true, initialData = null, onSuccess, onError, onFinish },
) {
  let cookies
  if (import.meta.env.SSR) {
    const { req, res } = useSSRContext()
    cookies = createCookies(req)()

    if (!cookies.get(COOKIE_KEY.GUEST_ID)) {
      const uuid = uuidv4()
      cookies.set(COOKIE_KEY.GUEST_ID, uuid)
      res.cookie(COOKIE_KEY.GUEST_ID, uuid)
    }
  } else {
    cookies = useCookies()
    if (!cookies.get(COOKIE_KEY.GUEST_ID)) {
      const uuid = uuidv4()
      cookies.set(COOKIE_KEY.GUEST_ID, uuid)
    }
  }

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
    reqParams.oauth_id = cookies.get(COOKIE_KEY.GUEST_ID)
    reqParams.oauth_type = 'pwa'

    // 塞 token
    const token = cookies.get(COOKIE_KEY.AUTH)
    if (token) {
      reqParams.token = token
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
        onSuccess && onSuccess(resData.data)
      })
      .catch((e) => {
        if (isCanceled.value) return
        error.value = e
        onError && onError(e)
      })
      .finally(() => {
        if (isCanceled.value) return
        isLoading.value = false
        isFinished.value = true
        onFinish && onFinish()
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
    execute()
  }

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
