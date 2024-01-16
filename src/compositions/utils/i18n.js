import { useI18n as useVueI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { getLang, loadLanguage } from '@/i18n'
import { useCookie } from '@use/utils/cookie'
import { computed } from 'vue'
import { COOKIE_KEY } from '@const'

let currLoadLang
let nextLoadLang

/**
 * 實際使用的 VueI18n 實例，僅能在 Vue 的 setup() 內使用
 * @returns { i18n, setLocale, $t }
 */
export function useI18n() {
  const i18n = useVueI18n()
  const cookieLocale = useCookie(COOKIE_KEY.LOCALE, { default: i18n.locale.value })

  const router = useRouter()

  async function _setLocale(langCode) {
    const lang = getLang(langCode)

    if (currLoadLang) {
      nextLoadLang = lang
      return
    }

    currLoadLang = lang

    if (!loadLanguage[lang]) {
      await loadLanguage(lang)
      i18n.setLocaleMessage(lang, loadLanguage[lang])
    }
    _setI18nLanguage(lang)

    currLoadLang = undefined

    if (nextLoadLang) {
      const lang = nextLoadLang
      nextLoadLang = undefined
      _setLocale(lang)
    }
  }

  function _setI18nLanguage(lang) {
    i18n.locale.value = lang
    cookieLocale.value = lang

    router.replace({ name: router.currentRoute.name, params: { lang } })

    return lang
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
