import i18n from '@/pages/dev-mode/i18n.vue'
import Pinia from '@/pages/dev-mode/Pinia.vue'
import Icon from '@/pages/dev-mode/Icon.vue'
import ClientOnly from '@/pages/dev-mode/ClientOnly.vue'
import OAuth from '@/pages/dev-mode/OAuth.vue'
import Tab from '@/pages/dev-mode/Tab.vue'
import Form from '@/pages/dev-mode/Form.vue'
import Dialog from '@/pages/dev-mode/Dialog.vue'
import Loading from '@/pages/dev-mode/Loading.vue'
import Cards from '@/pages/dev-mode/Cards.vue'

const prefix = 'devmode'
export default [
  { name: `${prefix}-i18n`, path: `/${prefix}/i18n`, component: i18n, meta: {} },
  { name: `${prefix}-Pinia`, path: `/${prefix}/pinia`, component: Pinia, meta: {} },
  { name: `${prefix}-icon`, path: `/${prefix}/icon`, component: Icon, meta: {} },
  { name: `${prefix}-ClientOnly`, path: `/${prefix}/client-only`, component: ClientOnly, meta: {} },
  { name: `${prefix}-OAuth`, path: `/${prefix}/google`, component: OAuth, meta: {} },
  { name: `${prefix}-Tab`, path: `/${prefix}/tab`, component: Tab, meta: {} },
  { name: `${prefix}-Form`, path: `/${prefix}/form`, component: Form, meta: {} },
  { name: `${prefix}-Dialog`, path: `/${prefix}/dialog`, component: Dialog, meta: {} },
  { name: `${prefix}-Loading`, path: `/${prefix}/loading`, component: Loading, meta: {} },
  { name: `${prefix}-Card`, path: `/${prefix}/card`, component: Cards, meta: {} },
]
