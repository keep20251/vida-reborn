import { createPinia } from 'pinia'
import { resetStore } from '@/utils/pinia-reset'

const pinia = createPinia()
pinia.use(resetStore)

export default pinia
