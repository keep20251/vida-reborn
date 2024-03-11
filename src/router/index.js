import { createMemoryHistory, createRouter as createVueRouter, createWebHistory } from 'vue-router'
import { useCookies } from '@vueuse/integrations/useCookies'
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
import { COOKIE_KEY } from '@const'
import { locales } from '@/i18n'
import AppLicationLayout from '@/layouts/Application.vue'
import OfficialLayout from '@/layouts/Official.vue'
import afterGuard from './guards/after'
import beforeGuard from './guards/before'
import checkPermission from './guards/before/check-permission'
import devRoutes from './routes/dev'
import errorRoutes from './routes/error'
import mineRoutes from './routes/mine'

const langRegex = locales.map((l) => l.value).join('|')

/**
 * @property checkLogin 用於判斷該頁面是否需要驗證登入狀態
 */
const routes = [
  {
    name: 'app',
    path: '/',
    children: [
      {
        name: 'official',
        path: '/',
        component: OfficialLayout, // layout for official
        children: [
          // landing
          { path: '/', redirect: redirectToLangPath },
          { name: 'landing', path: `/:lang(${langRegex})`, component: Landing, meta: {} },

          // academy
          { path: '/official/academy', redirect: redirectToLangPath },
          { name: 'academy', path: `/:lang(${langRegex})/official/academy`, component: Academy, meta: {} },

          { path: '/official/tos', redirect: redirectToLangPath },
          { name: 'official-tos', path: '/:lang/official/tos', component: ToS },

          { path: '/official/privacy-policy', redirect: redirectToLangPath },
          { name: 'official-pp', path: '/:lang/official/privacy-policy', component: PrivacyPolicy },

          { path: '/official/usc', redirect: redirectToLangPath },
          { name: 'official-usc', path: '/:lang/official/usc', component: Usc },

          { path: '/official/dmca', redirect: redirectToLangPath },
          { name: 'official-dmca', path: '/:lang/official/dmca', component: DMCA },

          { path: '/official/aup', redirect: redirectToLangPath },
          { name: 'official-aup', path: '/:lang/official/acceptable-use-policy', component: AUP },

          { path: '/official/cookie-policy', redirect: redirectToLangPath },
          { name: 'official-cookie-policy', path: '/:lang/official/cookie-policy', component: CookiePolicy },

          { path: '/official/complaints-policy', redirect: redirectToLangPath },
          {
            name: 'official-complaints-policy',
            path: '/:lang/official/complaints-policy',
            component: ComplaintsPolicy,
          },
        ],
      },
      {
        name: 'application', // layout for application
        path: '/',
        component: AppLicationLayout,
        children: [
          // home
          { path: '/home', redirect: redirectToLangPath },
          { name: 'home', path: `/:lang(${langRegex})/home`, component: Home, meta: {} },

          // search
          { path: '/search', redirect: redirectToLangPath },
          { name: 'search', path: `/:lang(${langRegex})/search`, component: Search, meta: {} },

          // message
          { path: '/message/:to?', redirect: redirectToLangPath },
          { name: 'message', path: `/:lang(${langRegex})/message/:to?`, component: Message, meta: {} },

          // mine
          {
            name: 'mine',
            path: `/:lang(${langRegex})/mine`,
            component: Mine,
            meta: {},
            children: mineRoutes.map((route) => ({ ...route, beforeEnter: checkPermission })),
          },

          // publish
          { path: '/publish', redirect: redirectToLangPath },
          { name: 'publish', path: `/:lang(${langRegex})/publish`, component: Publish, meta: {} },

          // creator
          { path: '/:username', redirect: redirectToLangPath },
          { name: 'creator', path: `/:lang(${langRegex})/:username`, component: Creator, meta: {} },

          // feed
          { path: '/:username/:feedId(\\d+)', redirect: redirectToLangPath },
          { name: 'feed', path: `/:lang(${langRegex})/:username/:feedId(\\d+)`, component: Feed, meta: {} },
        ],
      },
    ],
  },
  ...errorRoutes,
]

export function createRouter() {
  if (import.meta.env.DEV) {
    routes
      .find((r) => r.name === 'app')
      .children.find((r) => r.name === 'application')
      .children.push(...devRoutes)
  }

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

function redirectToLangPath(to) {
  // Server 端設計成不可能會有路徑沒有語言的情況
  if (import.meta.env.SSR) {
    throw new Error('SSR is impossible reach to this route redirector...')
  }

  // Client 端路徑沒有語言的話從 cookie 拿，Server 會在第一次執行的時候把語言設定至 cookie，保證會有
  const cookies = useCookies()
  const langPath = cookies.get(COOKIE_KEY.LOCALE, { path: '/' })
  const { lang, ...query } = to.query
  return { path: `/${langPath}${to.path}`, query }
}
