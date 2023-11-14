import { useLocalStorage } from '@vueuse/core'
import { LOCAL_STORAGE_KEYS } from '@/constant'

const BOT_LIST = ['googlebot', 'baiduspider', 'bingbot', 'yahoo! slurp', 'yandexbot']
const isBot = () => {
  if (!navigator || !navigator.userAgent) {
    return false
  }

  const agent = navigator.userAgent.toLowerCase()
  return BOT_LIST.findIndex((bot) => agent.indexOf(bot) !== -1) !== -1
}

export function useAdultChecked() {
  const adultChecked = useLocalStorage(LOCAL_STORAGE_KEYS.ADULT_CHECKED, isBot())

  return { adultChecked }
}
