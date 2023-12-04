import Home from '@/pages/dev-mode/Home.vue'
import i18n from '@/pages/dev-mode/i18n.vue'
import Pinia from '@/pages/dev-mode/Pinia.vue'
import Icons from '@/pages/dev-mode/Icons.vue'
import ClientOnly from '@/pages/dev-mode/ClientOnly.vue'
import OAuth from '@/pages/dev-mode/OAuth.vue'
import Tab from '@/pages/dev-mode/Tab.vue'
import Form from '@/pages/dev-mode/Form.vue'

const prefix = '/devmode'
export const devRoutes = [
  { path: `${prefix}/`, component: Home, meta: {} },
  { name: `${prefix}-home`, path: `${prefix}/home`, component: Home, meta: {} },
  { name: `${prefix}-i18n`, path: `${prefix}/i18n`, component: i18n, meta: {} },
  { name: `${prefix}-pinia`, path: `${prefix}/pinia`, component: Pinia, meta: {} },
  { name: `${prefix}-icons`, path: `${prefix}/icons`, component: Icons, meta: {} },
  { name: `${prefix}-client-only`, path: `${prefix}/client-only`, component: ClientOnly, meta: {} },
  { name: `${prefix}-google`, path: `${prefix}/google`, component: OAuth, meta: {} },
  { name: `${prefix}-tab`, path: `${prefix}/tab`, component: Tab, meta: {} },
  { name: `${prefix}-form`, path: `${prefix}/form`, component: Form, meta: {} },
]
