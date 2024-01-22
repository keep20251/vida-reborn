import './style.scss'
import App from './App.vue'
import router from '@/router'
import Page from '@comp/layout/Page.vue'
import Icon from '@comp/common/Icon.vue'
import Loading from '@comp/common/Loading.vue'
import ClientOnly from '@comp/common/ClientOnly'
import { createStore } from '@/store'
import { createSSRApp } from 'vue'
import { createHead } from '@unhead/vue'

export async function createApp() {
  const app = createSSRApp(App)
  const store = createStore()
  const head = createHead()

  app.use(router)
  app.use(store)
  app.use(head)

  app.component('Page', Page)
  app.component('Icon', Icon)
  app.component('Loading', Loading)
  app.component('ClientOnly', ClientOnly)

  return { app, router, store, head }
}
