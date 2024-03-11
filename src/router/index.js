import { createMemoryHistory, createRouter as createVueRouter, createWebHistory } from 'vue-router'
import Creator from '@/pages/creator/Creator.vue'
import Feed from '@/pages/feed/Feed.vue'
import Home from '@/pages/home/Home.vue'
import Message from '@/pages/message/Message.vue'
import Mine from '@/pages/mine/Mine.vue'
import Academy from '@/pages/official/Academy.vue'
import Landing from '@/pages/official/Landing.vue'
import AUP from '@/pages/official/terms/AUP.vue'
import ComplaintsPolicy from '@/pages/official/terms/ComplaintsPolicy.vue'
import CookiePolicy from '@/pages/official/terms/CookiePolicy.vue'
import DMCA from '@/pages/official/terms/DMCA.vue'
import PrivacyPolicy from '@/pages/official/terms/PrivacyPolicy.vue'
import ToS from '@/pages/official/terms/ToS.vue'
import Usc from '@/pages/official/terms/Usc.vue'
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
          {
            name: 'academy',
            path: '/:lang/official/academy',
            component: Academy,
            meta: {},
          },
          { name: 'official-tos', path: '/:lang/official/tos', component: ToS },
          { name: 'official-pp', path: '/:lang/official/privacy-policy', component: PrivacyPolicy },
          { name: 'official-usc', path: '/:lang/official/usc', component: Usc },
          { name: 'official-dmca', path: '/:lang/official/dmca', component: DMCA },
          { name: 'official-aup', path: '/:lang/official/acceptable-use-policy', component: AUP },
          { name: 'official-cookie-policy', path: '/:lang/official/cookie-policy', component: CookiePolicy },
          {
            name: 'official-complaints-policy',
            path: '/:lang/official/complaints-policy',
            component: ComplaintsPolicy,
          },
        ],
      },
    ],
  },
  ...errorRoutes,
]

export function createRouter() {
  if (import.meta.env.DEV) routes.find((route) => route.name === 'app').children[0].children.push(...devRoutes)

  const router = createVueRouter({
    history: import.meta.env.SSR ? createMemoryHistory() : createWebHistory(),
    routes: import.meta.env.DEV ? [...routes] : routes,
  })

  beforeGuard.forEach((guard) => router.beforeEach(guard))
  afterGuard.forEach((guard) => router.afterEach(guard))

  router.onError((e) => {
    console.error(e.message)
  })

  return router
}
