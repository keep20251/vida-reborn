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
import { locales } from '@/i18n'

const langRegex = locales.map((l) => l.value).join('|')

const prefix = 'devmode'
export default [
  {
    name: `${prefix}-hydration`,
    path: `/:lang(${langRegex})/${prefix}/hydration`,
    component: ssr2csrHydration,
    meta: {},
  },
  { name: `${prefix}-i18n`, path: `/:lang(${langRegex})/${prefix}/i18n`, component: i18n, meta: {} },
  { name: `${prefix}-pinia`, path: `/:lang(${langRegex})/${prefix}/pinia`, component: Pinia, meta: {} },
  { name: `${prefix}-icon`, path: `/:lang(${langRegex})/${prefix}/icon`, component: Icon, meta: {} },
  {
    name: `${prefix}-client-only`,
    path: `/:lang(${langRegex})/${prefix}/client-only`,
    component: ClientOnly,
    meta: {},
  },
  { name: `${prefix}-oauth`, path: `/:lang(${langRegex})/${prefix}/oauth`, component: OAuth, meta: {} },
  { name: `${prefix}-tab`, path: `/:lang(${langRegex})/${prefix}/tab`, component: Tab, meta: {} },
  { name: `${prefix}-form`, path: `/:lang(${langRegex})/${prefix}/form`, component: Form, meta: {} },
  { name: `${prefix}-dialog`, path: `/:lang(${langRegex})/${prefix}/dialog`, component: Dialog, meta: {} },
  { name: `${prefix}-modal`, path: `/:lang(${langRegex})/${prefix}/modal`, component: Modal, meta: {} },
  { name: `${prefix}-loading`, path: `/:lang(${langRegex})/${prefix}/loading`, component: Loading, meta: {} },
  { name: `${prefix}-card`, path: `/:lang(${langRegex})/${prefix}/card`, component: Cards, meta: {} },
]
