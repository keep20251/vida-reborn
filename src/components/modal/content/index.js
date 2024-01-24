import Text from './Text.vue'
import Test from './Test.vue'
import SocialLink from '@comp/modal/content/SocialLink.vue'
import SignUpSuccess from '@comp/modal/content/SignUpSuccess.vue'
import ApplyCreatorCert from '@comp/modal/content/ApplyCreatorCert.vue'
import InterestedPick from '@comp/modal/content/InterestedPick.vue'

import { MODAL_TYPE } from '@const'

export default Object.freeze({
  [MODAL_TYPE.ALERT]: Text,
  [MODAL_TYPE.CONFIRM]: Text,

  [MODAL_TYPE.SOCIAL_LINK]: SocialLink,
  [MODAL_TYPE.SIGN_UP_SUCCESS]: SignUpSuccess,

  [MODAL_TYPE.INTERESTED_PICK]: InterestedPick,
  [MODAL_TYPE.APPLY_CREATOR_CERT]: ApplyCreatorCert,

  [MODAL_TYPE.TEST]: Test,
})
