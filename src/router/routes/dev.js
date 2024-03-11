import Cards from '@/pages/dev-mode/Cards.vue'
import ClientOnly from '@/pages/dev-mode/ClientOnly.vue'
import Dialog from '@/pages/dev-mode/Dialog.vue'
import Form from '@/pages/dev-mode/Form.vue'
import Icon from '@/pages/dev-mode/Icon.vue'
import Loading from '@/pages/dev-mode/Loading.vue'
import Modal from '@/pages/dev-mode/Modal.vue'
import OAuth from '@/pages/dev-mode/OAuth.vue'
import Pinia from '@/pages/dev-mode/Pinia.vue'
import Tab from '@/pages/dev-mode/Tab.vue'
import i18n from '@/pages/dev-mode/i18n.vue'
import ssr2csrHydration from '@/pages/dev-mode/ssr2csrHydration.vue'

const prefix = 'devmode'
export default [
  {
    name: `${prefix}-hydration`,
    path: `/:lang/${prefix}/hydration`,
    component: ssr2csrHydration,
    meta: {},
  },
  { name: `${prefix}-i18n`, path: `/:lang/${prefix}/i18n`, component: i18n, meta: {} },
  { name: `${prefix}-pinia`, path: `/:lang/${prefix}/pinia`, component: Pinia, meta: {} },
  { name: `${prefix}-icon`, path: `/:lang/${prefix}/icon`, component: Icon, meta: {} },
  {
    name: `${prefix}-client-only`,
    path: `/:lang/${prefix}/client-only`,
    component: ClientOnly,
    meta: {},
  },
  { name: `${prefix}-oauth`, path: `/:lang/${prefix}/oauth`, component: OAuth, meta: {} },
  { name: `${prefix}-tab`, path: `/:lang/${prefix}/tab`, component: Tab, meta: {} },
  { name: `${prefix}-form`, path: `/:lang/${prefix}/form`, component: Form, meta: {} },
  { name: `${prefix}-dialog`, path: `/:lang/${prefix}/dialog`, component: Dialog, meta: {} },
  { name: `${prefix}-modal`, path: `/:lang/${prefix}/modal`, component: Modal, meta: {} },
  { name: `${prefix}-loading`, path: `/:lang/${prefix}/loading`, component: Loading, meta: {} },
  { name: `${prefix}-card`, path: `/:lang/${prefix}/card`, component: Cards, meta: {} },
]
