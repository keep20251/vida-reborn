import Home from '@/pages/dev-mode/Home.vue'
import i18n from '@/pages/dev-mode/i18n.vue'
import Pinia from '@/pages/dev-mode/Pinia.vue'
import Icon from '@/pages/dev-mode/Icon.vue'
import ClientOnly from '@/pages/dev-mode/ClientOnly.vue'
import OAuth from '@/pages/dev-mode/OAuth.vue'
import Tab from '@/pages/dev-mode/Tab.vue'
import Form from '@/pages/dev-mode/Form.vue'
import Dialog from '@/pages/dev-mode/Dialog.vue'
import Loading from '@/pages/dev-mode/Loading.vue'

const prefix = '/devmode'
export const devRoutes = [
  { path: `${prefix}/`, component: Home, meta: {} },
  { name: `${prefix}-home`, path: `${prefix}/home`, component: Home, meta: {} },
  { name: `${prefix}-i18n`, path: `${prefix}/i18n`, component: i18n, meta: {} },
  { name: `${prefix}-pinia`, path: `${prefix}/pinia`, component: Pinia, meta: {} },
  { name: `${prefix}-icon`, path: `${prefix}/icon`, component: Icon, meta: {} },
  { name: `${prefix}-client-only`, path: `${prefix}/client-only`, component: ClientOnly, meta: {} },
  { name: `${prefix}-google`, path: `${prefix}/google`, component: OAuth, meta: {} },
  { name: `${prefix}-tab`, path: `${prefix}/tab`, component: Tab, meta: {} },
  { name: `${prefix}-form`, path: `${prefix}/form`, component: Form, meta: {} },
  { name: `${prefix}-dialog`, path: `${prefix}/dialog`, component: Dialog, meta: {} },
  { name: `${prefix}-loading`, path: `${prefix}/loading`, component: Loading, meta: {} },
]
