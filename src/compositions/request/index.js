import { ref, shallowRef, readonly, useSSRContext } from 'vue'
import { useCookies, createCookies } from '@vueuse/integrations'
import { v4 as uuidv4 } from 'uuid'
import { COOKIE_KEY } from '@const'
import API from '@/http'

export default useRequest

function useRequest(
  apiKey,
  params,
  { immediate = true, shallow = true, initialData = null, onSuccess, onError, onFinish },
) {
  const reqParams = { ...params }

  let cookies
  if (import.meta.env.SSR) {
    const { req, res } = useSSRContext
    cookies = createCookies(req)()
    // TODO: 這邊可能需要初始化 cookie 的 oauth_id
    // if (!cookies.get(COOKIE_KEY.GUEST_ID)) {
    //   const uuid = uuidv4()
    //   cookies.set(COOKIE_KEY.GUEST_ID, uuid)
    //   res.cookie(COOKIE_KEY.GUEST_ID, uuid)
    // }
  } else {
    cookies = useCookies()
  }

  // 塞 oauth
  reqParams.oauth_id = cookies.get(COOKIE_KEY.GUEST_ID)
  reqParams.oauth_type = 'pwa'

  // 塞 token
  reqParams.token = cookies.get(COOKIE_KEY.AUTH)

  const data = (shallow ? shallowRef : ref)(initialData)
  const error = shallowRef(null)
  const isLoading = ref(false)
  const isFinished = ref(false)
  const isCanceled = ref(false)

  const [moduleName, name] = apiKey.split('.')
  const controller = new AbortController()

  function execute() {
    cancel()

    error.value = null
    isLoading.value = true
    isFinished.value = false
    isCanceled.value = false

    API[moduleName][name](
      { data: reqParams },
      {
        signal: controller.signal,
      },
    )
      .then((resData) => {
        if (isCanceled.value) return
        data.value = resData
        onSuccess && onSuccess(resData)
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
