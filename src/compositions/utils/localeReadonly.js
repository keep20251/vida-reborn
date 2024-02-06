import { readonly, ref } from 'vue'
import { useCookie } from '@use/utils/cookie'
import { COOKIE_KEY } from '@const'

export function useLocaleReadonly() {
  let cookieLocale = useCookie(COOKIE_KEY.LOCALE)
  if (!cookieLocale.value) {
    cookieLocale = ref('en')
  }
  return readonly(cookieLocale)
}
