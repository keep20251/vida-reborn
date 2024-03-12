import cloneDeep from 'lodash/cloneDeep'
import { createMemoryHistory, createRouter as createVueRouter, createWebHistory } from 'vue-router'
import { useCookies } from '@vueuse/integrations/useCookies'
import Main from '@/layouts/Main.vue'
import Official from '@/layouts/Official.vue'
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
import afterGuard from './guards/after'
import beforeGuard from './guards/before'
import checkPermission from './guards/before/check-permission'
import devRoutes from './routes/dev'
import errorRoutes from './routes/error'
import mineRoutes from './routes/mine'

const LANG_PATH = '/:lang'
const LANG_REGEX = locales.map((l) => l.value).join('|')

const ROUTES_TEMPLATE = [
  {
    name: 'app',
    path: '/',
    children: [
      {
        name: 'official',
        path: '/',
        component: Official,
        children: [
          { name: 'landing', path: '/:lang', component: Landing, meta: {} },
          { name: 'academy', path: '/:lang/official/academy', component: Academy, meta: {} },
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
      {
        name: 'main',
        path: '/',
        component: Main,
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
          { name: 'feed', path: '/:lang/:username/:feedId(\\d+)', component: Feed, meta: {} },
        ],
      },
    ],
  },
]

const routes = (() => {
  const template = cloneDeep(ROUTES_TEMPLATE)

  const mainChildren = template.find((r) => r.name === 'app').children.find((r) => r.name === 'main').children
  if (import.meta.env.DEV) {
    mainChildren.push(...devRoutes)
  }
  mainChildren.push(...errorRoutes)

  return createRoutes(template)
})()

export function createRouter() {
  const router = createVueRouter({
    history: import.meta.env.SSR ? createMemoryHistory() : createWebHistory(),
    routes,
  })

  beforeGuard.forEach((guard) => router.beforeEach(guard))
  afterGuard.forEach((guard) => router.afterEach(guard))

  router.onError((e) => {
    console.error(e.message)
  })

  return router
}

function createRoutes(routes) {
  return routes.reduce((a, r) => {
    const { path, children, ...rest } = r
    const hasLang = path.startsWith(LANG_PATH)

    // mine 不加重導
    if (hasLang && rest.name !== 'mine') {
      const noLangPath = path === LANG_PATH ? '/' : path.substring(LANG_PATH.length)
      a.push({ path: noLangPath, redirect: redirectToLangPath })
    }

    const newRoute = { ...rest }
    newRoute.path = hasLang ? `${LANG_PATH}(${LANG_REGEX})${path.substring(LANG_PATH.length)}` : path
    if (Array.isArray(children)) {
      newRoute.children = createRoutes(children)
    }
    a.push(newRoute)

    return a
  }, [])
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
