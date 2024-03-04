import { createMemoryHistory, createRouter as createVueRouter, createWebHistory } from 'vue-router'
import Creator from '@/pages/creator/Creator.vue'
import Feed from '@/pages/feed/Feed.vue'
import Home from '@/pages/home/Home.vue'
import Message from '@/pages/message/Message.vue'
import Mine from '@/pages/mine/Mine.vue'
import Landing from '@/pages/official/Landing.vue'
import Publish from '@/pages/publish/Publish.vue'
import Search from '@/pages/search/Search.vue'
import AppLicationLayout from '@/layouts/Application.vue'
import OfficialLayout from '@/layouts/Official.vue'
import afterGuard from './guards/after'
import beforeGuard from './guards/before'
import checkPermission from './guards/before/check-permission'
import devRoutes from './routes/dev'
import errorRoutes from './routes/error'
import mineRoutes from './routes/mine'

/**
 * @property checkLogin 用於判斷該頁面是否需要驗證登入狀態
 */
const routes = [
  {
    name: 'app',
    path: '/',
    // component: Application,
    children: [
      {
        name: 'applaction', // layout for application
        path: '/',
        component: AppLicationLayout,
        children: [
          { name: 'home', path: '/:lang/home', component: Home, meta: {} },
          { name: 'search', path: '/:lang/search', component: Search, meta: {} },
          { name: 'message', path: '/:lang/message/:to?', component: Message, meta: {} },
          {
            name: 'mine',
            path: '/:lang/mine',
            component: Mine,
            meta: {},
            children: mineRoutes.map((route) => ({ ...route, beforeEnter: checkPermission })),
          },
          { name: 'publish', path: '/:lang/publish', component: Publish, meta: {} },
          { name: 'creator', path: '/:lang/:username', component: Creator, meta: {} },
          { name: 'feed', path: '/:lang/:username/:feedId', component: Feed, meta: {} },
        ],
      },
      {
        name: 'official',
        path: '/',
        component: OfficialLayout, // layout for official
        children: [
          {
            name: 'landing',
            path: '/:lang',
            component: Landing,
            meta: {},
          },
        ],
      },
    ],
  },
  ...errorRoutes,
]

export function createRouter() {
  const router = createVueRouter({
    history: import.meta.env.SSR ? createMemoryHistory() : createWebHistory(),
    routes: import.meta.env.DEV ? [...routes, ...devRoutes] : routes,
  })

  beforeGuard.forEach((guard) => router.beforeEach(guard))
  afterGuard.forEach((guard) => router.afterEach(guard))

  router.onError((e) => {
    console.error(e.message)
  })

  return router
}
