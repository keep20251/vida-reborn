import { createRouter, createWebHistory, createMemoryHistory } from 'vue-router'
import devRoutes from './routes/dev'
import mineRoutes from './routes/mine'
import errorRoutes from './routes/error'
import beforeGuard from './guards/before'
import afterGuard from './guards/after'

import Home from '@/pages/home/Home.vue'
import Search from '@/pages/search/Search.vue'
import Message from '@/pages/message/Message.vue'
import Mine from '@/pages/mine/Mine.vue'

/**
 * @property checkLogin 用於判斷該頁面是否需要驗證登入狀態
 */
const routes = [
  { name: 'home', path: '/:lang/home', component: Home, meta: {} },
  { name: 'search', path: '/:lang/search', component: Search, meta: {} },
  { name: 'message', path: '/:lang/message', component: Message, meta: {} },
  { name: 'mine', path: '/:lang/mine', component: Mine, meta: {}, children: mineRoutes },
  ...errorRoutes,
]

const router = createRouter({
  history: import.meta.env.SSR ? createMemoryHistory() : createWebHistory(),
  routes: import.meta.env.DEV ? [...routes, ...devRoutes] : routes,
})

beforeGuard.forEach((guard) => router.beforeEach(guard))
afterGuard.forEach((guard) => router.afterEach(guard))

router.onError((e) => {
  console.error(e.message)
})

export default router
