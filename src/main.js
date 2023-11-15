import './style.scss'
import App from './App.vue'
import store from '@/store'
import router from '@/router'
import i18n from '@/i18n'
import { createSSRApp } from 'vue'

export function createApp() {
  const app = createSSRApp(App)

  app.use(i18n)
  app.use(router)
  app.use(store)

  return { app, router, store }
}
