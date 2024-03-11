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

export function getLang(langTmp = EN) {
  const locale = langTmp.replace('_', '-').toLowerCase()

  if (!locale) {
    return EN
  }

  const [languageCode, countryCode] = locale.split('-')
  if (languageCode === 'zh') {
    // 繁體/簡體區域碼參考 https://zh.wikipedia.org/zh-tw/Wikipedia:%E5%9C%B0%E5%8C%BA%E8%AF%8D%E5%A4%84%E7%90%86
    if (['hant', 'tw', 'hk', 'mo'].includes(countryCode)) {
      return TW
    }
    // 非繁中就預設簡中了
    return CN
    // if (['hans', 'cn', 'sg', 'my'].includes(countryCode)) {
    // return CN
    // }
  }

  if ([EN, ES, FR, DE, TH, VI, JA, KO, RU, PT, ID, AR, HI].includes(languageCode)) {
    return languageCode
  }

  return EN
}

export function containsLang(lang) {
  return locales.map((l) => l.value).indexOf(lang) !== -1
}
