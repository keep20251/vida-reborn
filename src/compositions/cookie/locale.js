import { readonly, watch } from 'vue'
import { useCookie } from '../utils/cookie'
import { setLocale as setI18nLocale, initLocale } from '@/i18n'

export function useCookieLocale() {
  const locale = useCookie('__LOCALE', { default: initLocale() })

  /**
   * @description 初始化語系
   * 如果是 SSR，則直接設定語系
   * 如果是 CSR，則監聽語系變更
   */
  function initial() {
    if (import.meta.env.SSR) {
      setI18nLocale(locale.value)
    }

    if (!import.meta.env.SSR) {
      watch(locale, (value) => setI18nLocale(value), { immediate: true })
    }
  }

  /**
   * 封裝 setLocale 方法，讓cookie/locale.js 作為 i18n/index.js 的 Proxy
   * @param {string} langCode
   */
  function setLocale(langCode) {
    locale.value = langCode
  }

  return {
    locale: readonly(locale),
    initial,
    setLocale,
  }
}
