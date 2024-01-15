import { createSharedComposable } from '@vueuse/core'
import { useI18n as useVueI18n } from 'vue-i18n'
import { getLang, loadedLanguages } from '@/i18n'
import { useCookie } from '@use/utils/cookie'
import { computed } from 'vue'
import { COOKIE_KEY } from '@const'

/**
 * 實際使用的 VueI18n 實例，僅能在 Vue 的 setup() 內使用
 * @returns { i18n, setLocale, $t }
 */
function useI18nInstance() {
  const i18n = useVueI18n()
  const cookieLocale = useCookie(COOKIE_KEY.LOCALE, { default: i18n.locale.value })

  async function _setLocale(langCode) {
    const lang = getLang(langCode)
    await _loadLanguageAsync(lang)
  }

  function _setI18nLanguage(lang) {
    i18n.locale.value = lang
    cookieLocale.value = lang
    return lang
  }

  function _loadLanguageAsync(lang) {
    if (i18n.locale.value === lang) {
      return Promise.resolve(_setI18nLanguage(lang))
    }

    if (loadedLanguages.includes(lang)) {
      return Promise.resolve(_setI18nLanguage(lang))
    }

    return import(`../../i18n/locale/${lang}.ts`).then((messages) => {
      console.log(`Lazy load ${lang} language pack...`)
      i18n.setLocaleMessage(lang, messages.default)
      loadedLanguages.push(lang)
      return _setI18nLanguage(lang)
    })
  }

  const $t = i18n.t

  /**
   * 作為 cookieLocale 跟 i18n.locale 的 Proxy 物件
   * 提供修改跟取得語系的介面
   */
  const locale = computed({
    get: () => cookieLocale.value,
    set: (val) => _setLocale(val),
  })

  return {
    i18n,
    locale,
    $t,
  }
}

export const useI18n = createSharedComposable(useI18nInstance)
