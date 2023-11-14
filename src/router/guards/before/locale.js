import { initLocale, getLang } from '@/i18n'
import { useLocalStorage } from '@vueuse/core'

export default (to, from, next) => {
  if (to.query.lang) {
    const storageLocale = useLocalStorage('__LOCALE', initLocale())
    storageLocale.value = getLang(to.query.lang)
  }
  next()
}
