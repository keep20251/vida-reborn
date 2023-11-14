import { createRouter, createWebHistory } from 'vue-router'
import beforeGuard from './guards/before'
import afterGuard from './guards/after'

const Home = () => import('@/pages/home/Home.vue')
const Search = () => import('@/pages/search/index.vue')
const Message = () => import('@/pages/message/Message.vue')
const Mine = () => import('@/pages/mine/Mine.vue')
const Publish = () => import('@/pages/publish/Publish.vue')
const Creator = () => import('@/pages/creator/Creator.vue')

/**
 * @property checkLogin 用於判斷該頁面是否需要驗證登入狀態
 */
const routes = [
  { path: '/', redirect: { name: 'home' } },
  { name: 'home', path: '/home', component: Home, meta: { checkLogin: false } },
  { name: 'search', path: '/search', component: Search, meta: { checkLogin: false } },
  { name: 'publish', path: '/publish', component: Publish, meta: { checkLogin: true } },
  { name: 'message', path: '/message', component: Message, meta: { checkLogin: true } },
  { name: 'mine', path: '/mine', component: Mine, meta: { checkLogin: false } },
  { name: 'creator', path: '/:username', component: Creator, meta: { checkLogin: false } },
  {
    name: 'share-media',
    path: '/@:username/:mediaType/:id',
    redirect: (to) => {
      return { name: 'home', query: { ...to.params, ...to.query } }
    },
  },
]

// 開發測試用路由
const testRoutes = []

const router = createRouter({
  history: createWebHistory(),
  routes: import.meta.env.DEV ? [...routes, ...testRoutes] : routes,
})

beforeGuard.forEach((guard) => router.beforeEach(guard))
afterGuard.forEach((guard) => router.afterEach(guard))

router.onError((e) => {
  console.error(e.message)
})

export default router
