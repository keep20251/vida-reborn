import { ref, watch, readonly, useSSRContext } from 'vue'
import { useCookies, createCookies } from '@vueuse/integrations/useCookies'

export function useCookie(key, { default: defaultValue, readonly: isReadonly = false } = {}) {
  const cookie = ref(defaultValue)

  let cookies, req, res
  if (import.meta.env.SSR) {
    const ctx = useSSRContext()
    ;[req, res] = [ctx.req, ctx.res]
    cookies = createCookies(req)()
  } else {
    cookies = useCookies()
  }

  const existCookie = cookies.get(key)
  if (existCookie === undefined) {
    if (defaultValue !== undefined) {
      cookies.set(key, defaultValue)
      if (import.meta.env.SSR) {
        res.cookie(key, defaultValue)
      }
    }
  } else {
    cookie.value = cookies.get(key)
  }

  // Server 端不支援響應性
  if (!import.meta.env.SSR) {
    watch(cookie, (newCookie) => {
      cookies.set(key, newCookie)
    })
  }

  return isReadonly ? readonly(cookie) : cookie
}
