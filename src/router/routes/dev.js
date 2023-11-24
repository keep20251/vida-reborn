import Home from '@/pages/dev-mode/Home.vue'
import i18n from '@/pages/dev-mode/i18n.vue'
import Pinia from '@/pages/dev-mode/Pinia.vue'
import Icons from '@/pages/dev-mode/Icons.vue'
import Cookie from '@/pages/dev-mode/Cookie.vue'

const prefix = '/devmode'
export const devRoutes = [
  { path: `${prefix}/`, component: Home, meta: {} },
  { name: `${prefix}-home`, path: `${prefix}/home`, component: Home, meta: {} },
  { name: `${prefix}-i18n`, path: `${prefix}/i18n`, component: i18n, meta: {} },
  { name: `${prefix}-pinia`, path: `${prefix}/pinia`, component: Pinia, meta: {} },
  { name: `${prefix}-icons`, path: `${prefix}/icons`, component: Icons, meta: {} },
  { name: `${prefix}-cookie`, path: `${prefix}/cookie`, component: Cookie, meta: {} },
]
