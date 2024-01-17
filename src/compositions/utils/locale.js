import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { getLang, loadLanguage } from '@/i18n'
import { useCookie } from '@use/utils/cookie'
import { computed } from 'vue'
import { COOKIE_KEY } from '@const'

let currLoadLang
let nextLoadLang

/**
 * Locale 取得與設定，內部會在設定的時候將環境配置好
 *
 * @return locale
 */
export function useLocale() {
  const i18n = useI18n()
  const cookieLocale = useCookie(COOKIE_KEY.LOCALE, { default: i18n.locale.value })

  const router = useRouter()

  async function setLocale(langCode) {
    const lang = getLang(langCode)

    if (currLoadLang) {
      nextLoadLang = lang
      return
    }

    currLoadLang = lang

    await loadLanguage(lang)
    i18n.setLocaleMessage(lang, loadLanguage[lang])

    setI18nLanguage(lang)

    currLoadLang = undefined

    if (nextLoadLang) {
      const lang = nextLoadLang
      nextLoadLang = undefined
      setLocale(lang)
    }
  }

  function setI18nLanguage(lang) {
    i18n.locale.value = lang
    cookieLocale.value = lang

    router.replace({ name: router.currentRoute.name, params: { lang } })

    return lang
  }

  return computed({
    get: () => cookieLocale.value,
    set: (val) => setLocale(val),
  })
}
