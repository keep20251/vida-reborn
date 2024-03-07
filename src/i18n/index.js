import { createI18n as createVueI18n } from 'vue-i18n'

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
export const locales = Object.freeze([
  { label: 'en', value: EN, key: 'lang.en' },
  { label: 'zh_cn', value: CN, key: 'lang.zh_cn' },
  { label: 'zh_tw', value: TW, key: 'lang.zh_tw' },
  { label: 'es', value: ES, key: 'lang.es' },
  { label: 'fr', value: FR, key: 'lang.fr' },
  { label: 'de', value: DE, key: 'lang.de' },
  { label: 'th', value: TH, key: 'lang.th' },
  { label: 'vi', value: VI, key: 'lang.vi' },
  { label: 'ja', value: JA, key: 'lang.ja' },
  { label: 'ko', value: KO, key: 'lang.ko' },
  { label: 'ru', value: RU, key: 'lang.ru' },
  { label: 'pt', value: PT, key: 'lang.pt' },
  { label: 'id', value: ID, key: 'lang.id' },
  { label: 'ar', value: AR, key: 'lang.ar' },
  { label: 'hi', value: HI, key: 'lang.hi' },
])

function initLocale() {
  const defaultLang = import.meta.env.SSR ? 'en' : navigator.language?.toLocaleLowerCase()
  return getLang(defaultLang)
}

/**
 * 初始化 i18n
 * @param {string} locale Cookie的語系
 * @returns Object i18n 實體
 */
export async function createI18n(locale) {
  const lang = locale ? getLang(locale) : initLocale()

  await loadLanguage(lang)
  const messages = { [lang]: loadLanguage[lang] }

  const i18n = createVueI18n({
    legacy: false,
    locale: lang,
    fallbackLocale: EN,
    messages,
  })
  return i18n
}

export async function loadLanguage(lang) {
  if (loadLanguage[lang]) {
    return
  }
  loadLanguage[lang] = (await import(`./locale/${lang}.ts`)).default
}

export function getLang(langTmp) {
  const lang = langTmp.replace('_', '-')
  const localeCodes = locales.map((locale) => locale.value)
  let matches = null
  localeCodes.forEach((code) => {
    if (lang.includes(code)) matches = code
    if (lang.includes('zh-hk')) matches = TW
  })
  return matches || EN
}

export function containsLang(lang) {
  return locales.map((l) => l.value).indexOf(lang) !== -1
}
