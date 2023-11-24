import { createRouter, createWebHistory, createMemoryHistory } from 'vue-router'
import { devRoutes } from './routes/dev'
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
  { path: '/', redirect: { name: 'home' } },
  { name: 'home', path: '/home', component: Home, meta: {} },
  { name: 'search', path: '/search', component: Search, meta: {} },
  { name: 'message', path: '/message', component: Message, meta: {} },
  { name: 'mine', path: '/mine', component: Mine, meta: {} },
  { name: '404', path: '/:catchAll(.*)', component: () => import('@/pages/errors/404.vue'), meta: {} },
]

const router = createRouter({
  history: import.meta.env.SSR ? createMemoryHistory() : createWebHistory(),
  routes: import.meta.env.DEV ? [...routes, ...devRoutes] : routes,
})

if (!import.meta.env.SSR) {
  beforeGuard.forEach((guard) => router.beforeEach(guard))
  afterGuard.forEach((guard) => router.afterEach(guard))
}

router.onError((e) => {
  console.error(e.message)
})

export default router
