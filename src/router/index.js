import { createMemoryHistory, createRouter as createVueRouter, createWebHistory } from 'vue-router'
import { useCookies } from '@vueuse/integrations/useCookies'
import Creator from '@/pages/creator/Creator.vue'
import Feed from '@/pages/feed/Feed.vue'
import Home from '@/pages/home/Home.vue'
import Message from '@/pages/message/Message.vue'
import Mine from '@/pages/mine/Mine.vue'
import Academy from '@/pages/official/Academy.vue'
import Landing from '@/pages/official/Landing.vue'
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
        ],
      },
      {
        name: 'applaction', // layout for application
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
          { path: '/:username/:feedId', redirect: redirectToLangPath },
          { name: 'feed', path: `/:lang(${langRegex})/:username/:feedId`, component: Feed, meta: {} },
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
