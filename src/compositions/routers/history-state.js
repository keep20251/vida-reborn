import { useRoute } from 'vue-router'
import { useLocale } from '../utils/locale'

export function useHistoryState(initUrl = '') {
  const STATE_REPLACE = '__STATE_REPLACE'
  const STATE_PUSH = '__STATE_PUSH'

  const history = []

  const route = useRoute()
  const locale = useLocale()

  function replace(url = initUrl) {
    history.push({ type: STATE_REPLACE, url: route.path })
    window.history.replaceState({}, '', `/${locale.value}${url}`)
  }

  function push(url = initUrl) {
    history.push({ type: STATE_PUSH, url: route.path })
    window.history.pushState({}, '', `/${locale.value}${url}`)
  }

  function revert() {
    if (history.length === 0) {
      console.warn('History is empty, you should not call revert()')
      return
    }

    const prev = history.pop()
    if (prev.type === STATE_REPLACE) {
      window.history.replaceState({}, '', prev.url)
    } else {
      window.history.back()
    }
  }

  return { push, replace, revert }
}
