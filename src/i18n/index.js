import { createI18n } from 'vue-i18n'

import zhCn from './locale/zh-cn'
import zhTw from './locale/zh-tw'
import en from './locale/en'
import es from './locale/es'
import fr from './locale/fr'
import de from './locale/de'
import th from './locale/th'
import vi from './locale/vi'
import ja from './locale/ja'
import ko from './locale/ko'
import ru from './locale/ru'
import pt from './locale/pt'
import id from './locale/id'
import ar from './locale/ar'
import hi from './locale/hi'

import { useLocalStorage } from '@vueuse/core'
import { watch } from 'vue'

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

export const storageLocale = useLocalStorage('__LOCALE', initLocale)

const i18n = createI18n({
  locale: storageLocale.value,
  fallbackLocale: EN,
  messages: {
    [CN]: zhCn,
    [TW]: zhTw,
    [EN]: en,
    [ES]: es,
    [FR]: fr,
    [DE]: de,
    [TH]: th,
    [VI]: vi,
    [JA]: ja,
    [KO]: ko,
    [RU]: ru,
    [PT]: pt,
    [ID]: id,
    [AR]: ar,
    [HI]: hi,
  },
})

watch(storageLocale, (value) => {
  i18n.global.locale.value = value
})

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
  const defaultLang = navigator.language?.toLocaleLowerCase()
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

export const $t = i18n.global.t

export default i18n
