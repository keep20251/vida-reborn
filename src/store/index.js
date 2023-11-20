import { createPinia } from 'pinia'
import { resetStore } from '@/utils/pinia-reset'

export const createStore = () => {
  const pinia = createPinia()
  pinia.use(resetStore)
  return pinia
}
