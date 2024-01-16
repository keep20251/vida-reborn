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

export const locales = [TW, CN, EN, ES, FR, DE, TH, VI, JA, KO, RU, PT, ID, AR, HI]

export function containsLang(lang) {
  return locales.indexOf(lang) !== -1
}
