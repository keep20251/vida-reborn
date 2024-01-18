import { readonly, ref } from 'vue'
import { useCookie } from '@use/utils/cookie'
import { COOKIE_KEY } from '@const'

export function useLocaleReadonly() {
  const cookieLocale = ref(useCookie(COOKIE_KEY.LOCALE).value || 'en')
  return readonly(cookieLocale)
}
