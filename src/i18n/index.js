import { createI18n } from 'vue-i18n'

import en from './locale/en'

import { useLocalStorage } from '@vueuse/core'
import { readonly, watch } from 'vue'
import { LOCAL_STORAGE_KEYS } from '@/constant'

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

const loadedLanguages = [EN]

const i18n = createI18n({
  locale: EN,
  fallbackLocale: EN,
  messages: {
    [EN]: en,
  },
})

const storageLocale = useLocalStorage(LOCAL_STORAGE_KEYS.LOCALE, initLocale)
if (!import.meta.env.SSR) {
  watch(storageLocale, (value) => loadLanguageAsync(value), { immediate: true })
}

export const locale = readonly(storageLocale)

export async function setLocale(langCode) {
  storageLocale.value = getLang(langCode)
}

/**
 * @description 目前可使用的語系
 * 如果需要新增語系，首先要先到 src/i18n/locales 裡面新增語系檔案
 * 然後再到這裡新增語系選項
 * 小心[dash]跟[underline]的差異
 */
export const locales = Object.freeze([
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

export function initLocale() {
  const defaultLang = import.meta.env.SSR ? 'en' : navigator.language?.toLocaleLowerCase()
  return getLang(defaultLang)
}

export function getLang(langTmp) {
  const lang = langTmp.replace('_', '-')
  const localeCodes = [CN, TW, EN, ES, FR, DE, TH, VI, JA, KO, RU, PT, ID, AR, HI]
  let matches = null
  localeCodes.forEach((code) => {
    if (lang.includes(code)) matches = code
    if (lang.includes('zh-hk')) matches = TW
  })
  return matches || EN
}

function setI18nLanguage(lang) {
  i18n.global.locale.value = lang
  return lang
}

function loadLanguageAsync(lang) {
  if (i18n.global.locale.value === lang) {
    return Promise.resolve(setI18nLanguage(lang))
  }

  if (loadedLanguages.includes(lang)) {
    return Promise.resolve(setI18nLanguage(lang))
  }

  return import(`./locale/${lang}.ts`).then((messages) => {
    console.log(`Lazy load ${lang} language pack...`)
    i18n.global.setLocaleMessage(lang, messages.default)
    loadedLanguages.push(lang)
    return setI18nLanguage(lang)
  })
}

export const $t = i18n.global.t

export default i18n
