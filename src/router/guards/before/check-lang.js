import { useCookies } from '@vueuse/integrations/useCookies'
import { COOKIE_KEY } from '@const'

/**
 * 路徑中的 :lang 若與 cookie 中的不一致
 * 改成使用 cookie 的
 */
export default (to) => {
  if (import.meta.env.SSR) {
    return
  }

  const cookies = useCookies()
  const cookieLang = cookies.get(COOKIE_KEY.LOCALE, { path: '/' })
  if (to.params.lang && to.params.lang !== cookieLang) {
    return {
      name: to.name,
      params: { ...to.params, lang: cookieLang },
      query: to.query,
    }
  }
}
