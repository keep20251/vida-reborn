import './style.scss'
import App from './App.vue'
import router from '@/router'
import Page from '@comp/layout/Page.vue'
import Icon from '@comp/common/Icon.vue'
import ClientOnly from '@/components/common/ClientOnly'
import { createStore } from '@/store'
import { createSSRApp } from 'vue'

export async function createApp() {
  const app = createSSRApp(App)
  const store = createStore()

  app.use(router)
  app.use(store)

  app.component('Page', Page)
  app.component('Icon', Icon)
  app.component('ClientOnly', ClientOnly)

  return { app, router, store }
}
