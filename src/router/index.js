import { createRouter, createWebHistory, createMemoryHistory } from 'vue-router'
import beforeGuard from './guards/before'
import afterGuard from './guards/after'

const Home = () => import('@/pages/home/Home.vue')

/**
 * @property checkLogin 用於判斷該頁面是否需要驗證登入狀態
 */
const routes = [
  { path: '/', redirect: { name: 'home' } },
  { name: 'home', path: '/home', component: Home, meta: {} },
]

// 開發測試用路由
const testRoutes = []

const router = createRouter({
  history: import.meta.env.SSR ? createMemoryHistory() : createWebHistory(),
  routes: import.meta.env.DEV ? [...routes, ...testRoutes] : routes,
})

beforeGuard.forEach((guard) => router.beforeEach(guard))
afterGuard.forEach((guard) => router.afterEach(guard))

router.onError((e) => {
  console.error(e.message)
})

export default router
