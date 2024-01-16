import { ref, watch, readonly, useSSRContext } from 'vue'
import { useCookies, createCookies } from '@vueuse/integrations/useCookies'

const clientCookieRefMap = new Map()

export function useCookie(key, { default: defaultValue, readonly: isReadonly = false } = {}) {
  let cookieRef
  let cookieRefMap
  let cookies, req, res

  if (import.meta.env.SSR) {
    // SSR cookies
    const ctx = useSSRContext()
    ;[req, res] = [ctx.req, ctx.res]
    cookies = createCookies(req)()

    // SSR cookieRefMap
    if (!ctx.cookieRefMap) {
      ctx.cookieRefMap = new Map()
    }
    cookieRefMap = ctx.cookieRefMap
  } else {
    // CSR cookies
    cookies = useCookies()

    // CSR cookieRefMap
    cookieRefMap = clientCookieRefMap
  }

  // 緩存中取 cookieRef
  if (cookieRefMap.has(key)) {
    cookieRef = cookieRefMap.get(key)
  }

  // 緩存中沒有 cookieRef
  // 建一個新的，並且將預設值和監聽配置好
  else {
    const existCookie = cookies.get(key)
    if (existCookie === undefined) {
      switch (typeof defaultValue) {
        case 'undefined':
        case 'string':
          cookieRef = ref(defaultValue)
          break
        case 'function':
          cookieRef = ref(defaultValue())
          break
      }
      const cookie = cookieRef.value
      if (cookie !== undefined) {
        cookies.set(key, cookie, { path: '/' })
        if (import.meta.env.SSR) {
          res.cookie(key, cookie, { path: '/' })
        }
      }
    } else {
      cookieRef = ref(existCookie)
    }

    cookieRefMap.set(key, cookieRef)

    // Server 端不支援響應性
    if (!import.meta.env.SSR) {
      watch(cookieRef, (newCookie) => {
        cookies.set(key, newCookie, { path: '/' })
      })
    }
  }

  return isReadonly ? readonly(cookieRef) : cookieRef
}
