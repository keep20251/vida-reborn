import { createI18n, useI18n as useVueI18n } from 'vue-i18n'
import { useCookieLocale } from '@use/cookie/locale'
import en from './locale/en'
import { readonly } from 'vue'

const TW = 'zh-tw'
const CN = 'zh-cn'
const EN = 'en'
const ES = 'es'
const FR = 'fr'
const DE = 'de'
const TH = 'th'
const VI = 'vi'
const JA = 'ja'
const KO = 'ko'
const RU = 'ru'
const PT = 'pt'
const ID = 'id'
const AR = 'ar'
const HI = 'hi'

/**
 * @description 目前可使用的語系
 * 如果需要新增語系，首先要先到 src/i18n/locales 裡面新增語系檔案
 * 然後再到這裡新增語系選項
 * 小心[dash]跟[underline]的差異
 */
const locales = Object.freeze([
  { label: 'en', value: EN },
  { label: 'zh_cn', value: CN },
  { label: 'zh_tw', value: TW },
  { label: 'es', value: ES },
  { label: 'fr', value: FR },
  { label: 'de', value: DE },
  { label: 'th', value: TH },
  { label: 'vi', value: VI },
  { label: 'ja', value: JA },
  { label: 'ko', value: KO },
  { label: 'ru', value: RU },
  { label: 'pt', value: PT },
  { label: 'id', value: ID },
  { label: 'ar', value: AR },
  { label: 'hi', value: HI },
])

const loadedLanguages = [EN]

export function useI18n(ctx = {}) {
  const { locale } = useCookieLocale({ ctx, default: initLocale() })

  async function initI18n() {
    const lang = getLang(locale.value)
    loadedLanguages.push(lang)

    const messages = { en }
    const defaultLangPack = lang === 'en' ? null : (await import(`./locale/${lang}`)).default
    if (defaultLangPack) messages[lang] = defaultLangPack

    const i18n = createI18n({
      legacy: false,
      locale: lang,
      fallbackLocale: EN,
      messages,
    })
    return i18n
  }

  function initLocale() {
    const defaultLang = import.meta.env.SSR ? 'en' : navigator.language?.toLocaleLowerCase()
    return getLang(defaultLang)
  }

  function getLang(langTmp) {
    const lang = langTmp.replace('_', '-')
    const localeCodes = locales.map((locale) => locale.value)
    let matches = null
    localeCodes.forEach((code) => {
      if (lang.includes(code)) matches = code
      if (lang.includes('zh-hk')) matches = TW
    })
    return matches || EN
  }

  /**
   * 實際使用的 VueI18n 實例，僅能在 Vue 的 setup() 內使用
   * @returns { i18n, setLocale, $t }
   */
  function useVueI18nInstance() {
    const i18n = useVueI18n()

    async function setLocale(langCode) {
      const lang = getLang(langCode)
      await loadLanguageAsync(lang)
    }

    function setI18nLanguage(lang) {
      i18n.locale.value = lang
      locale.value = lang
      return lang
    }

    function loadLanguageAsync(lang) {
      if (i18n.locale.value === lang) {
        return Promise.resolve(setI18nLanguage(lang))
      }

      if (loadedLanguages.includes(lang)) {
        return Promise.resolve(setI18nLanguage(lang))
      }

      return import(`./locale/${lang}`).then((messages) => {
        console.log(`Lazy load ${lang} language pack...`)
        i18n.setLocaleMessage(lang, messages.default)
        loadedLanguages.push(lang)
        return setI18nLanguage(lang)
      })
    }

    const $t = i18n.t

    return {
      i18n,
      setLocale,
      $t,
    }
  }

  return {
    locale: readonly(locale),
    locales,
    initI18n,
    useVueI18nInstance,
    getLang,
  }
}
