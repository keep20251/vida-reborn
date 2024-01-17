import Text from './Text.vue'
import Test from './Test.vue'
import SocialLink from '@/components/modal/content/SocialLink.vue'

import { MODAL_TYPE } from '@/constant'

export default Object.freeze({
  [MODAL_TYPE.ALERT]: Text,
  [MODAL_TYPE.CONFIRM]: Text,
  [MODAL_TYPE.SOCIAL_LINK]: SocialLink,
  [MODAL_TYPE.TEST]: Test,
})
