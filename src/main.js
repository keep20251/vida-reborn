import { createHead } from '@unhead/vue'
import { createSSRApp } from 'vue'
import ClientOnly from '@comp/common/ClientOnly'
import Icon from '@comp/common/Icon.vue'
import Loading from '@comp/common/Loading.vue'
import Page from '@comp/layout/Page.vue'
import EncryptImage from '@comp/multimedia/EncryptImage.vue'
import { createRouter } from '@/router'
import { createStore } from '@/store'
import App from './App.vue'
import './style.scss'

export async function createApp() {
  const app = createSSRApp(App)
  const store = createStore()
  const head = createHead()
  const router = createRouter()

  app.use(router)
  app.use(store)
  app.use(head)

  app.component('Page', Page)
  app.component('Icon', Icon)
  app.component('Loading', Loading)
  app.component('ClientOnly', ClientOnly)
  app.component('EncryptImage', EncryptImage)

  return { app, router, store, head }
}
