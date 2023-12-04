import './style.scss'
import App from './App.vue'
import { createStore } from '@/store'
import router from '@/router'
import i18n from '@/i18n'
import { createSSRApp } from 'vue'
import Page from '@comp/layout/Page.vue'
import Icon from '@comp/common/Icon.vue'

export function createApp() {
  const app = createSSRApp(App)
  const store = createStore()

  app.use(i18n)
  app.use(router)
  app.use(store)

  app.component('Page', Page)
  app.component('Icon', Icon)

  return { app, router, store }
}
