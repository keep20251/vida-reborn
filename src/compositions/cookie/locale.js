import { createCookies, useCookies } from '@vueuse/integrations/useCookies'
import { COOKIE_KEY } from '@const'
import { computed, useSSRContext } from 'vue'

/**
 * 這個 composition 用來取得 cookie 中的 locale，並且提供響應式的 locale
 * @param {Object} ssrContext
 * @returns { Object: { locale:ComputedRef } }
 */
export function useCookieLocale({ ctx: ssrContext = null, default: defaultValue = 'en' } = {}) {
  /**
   * @description SSR 時，如果是entry-server，則直接從參數取得 SSR context，否則從 useSSRContext 取得 SSR context
   */
  let ctx = null
  if (import.meta.env.SSR) ctx = ssrContext ?? useSSRContext()

  if (import.meta.env.SSR && !ctx) {
    throw new Error('useCookieLocale: SSR context is required if in SSR mode.')
  }

  const cookies = import.meta.env.SSR ? createCookies(ctx.req)() : useCookies()

  const path = '/'
  const locale = computed({
    get: () => cookies.get(COOKIE_KEY.LOCALE, { path }),
    set: (value) => cookies.set(COOKIE_KEY.LOCALE, value, { path }),
  })

  if (!locale.value) {
    locale.value = defaultValue
    console.warn(
      `[useCookieLocale]Failed to load cookie locale, set the default locale value [${locale.value}] to application`,
    )
  } else {
    console.log(`[useCookieLocale]Cookie locale is loaded, set the locale [${locale.value}] to application`)
  }

  return {
    locale,
  }
}
