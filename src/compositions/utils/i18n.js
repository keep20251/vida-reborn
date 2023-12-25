import { useI18n as useVueI18n } from 'vue-i18n'
import { useI18n } from '@/i18n'
import { useCookie } from '@use/utils/cookie'
import { readonly } from 'vue'
import { COOKIE_KEY } from '@const'

/**
 * 實際使用的 VueI18n 實例，僅能在 Vue 的 setup() 內使用
 * @returns { i18n, setLocale, $t }
 */
export function useI18nInstance() {
  const i18n = useVueI18n()
  const { getLang, loadedLanguages } = useI18n()
  const cookieLocale = useCookie(COOKIE_KEY.LOCALE)

  async function setLocale(langCode) {
    const lang = getLang(langCode)
    await loadLanguageAsync(lang)
  }

  function setI18nLanguage(lang) {
    i18n.locale.value = lang
    cookieLocale.value = lang
    return lang
  }

  function loadLanguageAsync(lang) {
    if (i18n.locale.value === lang) {
      return Promise.resolve(setI18nLanguage(lang))
    }

    if (loadedLanguages.includes(lang)) {
      return Promise.resolve(setI18nLanguage(lang))
    }

    return import(`../../i18n/locale/${lang}.ts`).then((messages) => {
      console.log(`Lazy load ${lang} language pack...`)
      i18n.setLocaleMessage(lang, messages.default)
      loadedLanguages.push(lang)
      return setI18nLanguage(lang)
    })
  }

  const $t = i18n.t

  return {
    i18n,
    locale: readonly(cookieLocale),
    setLocale,
    $t,
  }
}
