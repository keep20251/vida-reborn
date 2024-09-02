import { onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useLocale } from '../utils/locale'

export function useHistoryState(initUrl = '') {
  const STATE_REPLACE = '__STATE_REPLACE'
  const STATE_PUSH = '__STATE_PUSH'

  const history = []

  const route = useRoute()
  const locale = useLocale()

  function replace(url = initUrl, { onPrev = () => {} }) {
    history.push({ type: STATE_REPLACE, url: route.path, onPrev })
    window.history.replaceState({}, '', `/${locale.value}${url}`)
  }

  function push(url = initUrl, { onPrev = () => {} }) {
    history.push({ type: STATE_PUSH, url: route.path, onPrev })
    window.history.pushState({}, '', `/${locale.value}${url}`)
  }

  function revert() {
    if (history.length === 0) {
      console.warn('History is empty, you should not call revert()')
      return
    }

    const { type, url, onPrev } = history.pop()
    onPrev && onPrev()

    if (type === STATE_REPLACE) {
      window.history.replaceState({}, '', url)
    } else {
      window.history.back()
    }
  }

  onMounted(() => {
    window.addEventListener('popstate', () => {
      if (history.length > 0) {
        const prev = history.pop()
        prev.onPrev && prev.onPrev()
      }
    })
  })
  onUnmounted(() => {
    window.removeEventListener('popstate', () => {
      console.log('removeEventListener')
    })
  })

  return { push, replace, revert }
}
