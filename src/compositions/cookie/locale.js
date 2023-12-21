import { createCookies, useCookies } from '@vueuse/integrations/useCookies'
import { COOKIE_KEY } from '@const'
import { computed, useSSRContext } from 'vue'

/**
 * 這個 composition 用來取得 cookie 中的 locale，並且提供響應式的 locale
 * @param {Object} ssrContext
 * @returns { Object: { locale:ComputedRef } }
 */
export function useCookieLocale({ ctx: ssrContext = {}, default: defaultValue = 'en' } = {}) {
  /**
   * @description SSR 時，如果是entry-server，則直接從參數取得 SSR context，否則從 useSSRContext 取得 SSR context
   */
  const ctx = ssrContext || useSSRContext()

  if (import.meta.env.SSR && !ctx) {
    throw new Error('useCookieLocale: SSR context is required if in SSR mode.')
  }

  const cookies = import.meta.env.SSR ? createCookies(ctx.req)() : useCookies()

  const locale = computed({
    get: () => cookies.get(COOKIE_KEY.LOCALE),
    set: (value) => cookies.set(COOKIE_KEY.LOCALE, value),
  })

  if (!locale.value) locale.value = defaultValue

  return {
    locale,
  }
}
