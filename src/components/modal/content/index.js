import { MODAL_TYPE } from '@const'
import ApplyCreatorCert from './ApplyCreatorCert.vue'
import CookiePolicy from './CookiePolicy.vue'
import InterestedPick from './InterestedPick.vue'
import PhotoCapture from './PhotoCapture.vue'
import PrivacyPolicy from './PrivacyPolicy.vue'
import Progress from './Progress.vue'
import SignUpSuccess from './SignUpSuccess.vue'
import SocialLink from './SocialLink.vue'
import TermsOfService from './TermsOfService.vue'
import Test from './Test.vue'
import Text from './Text.vue'

export default Object.freeze({
  [MODAL_TYPE.ALERT]: Text,
  [MODAL_TYPE.CONFIRM]: Text,
  [MODAL_TYPE.PROGRESS]: Progress,

  [MODAL_TYPE.SOCIAL_LINK]: SocialLink,
  [MODAL_TYPE.SIGN_UP_SUCCESS]: SignUpSuccess,

  [MODAL_TYPE.INTERESTED_PICK]: InterestedPick,
  [MODAL_TYPE.APPLY_CREATOR_CERT]: ApplyCreatorCert,
  [MODAL_TYPE.PHOTO_CAPTURE]: PhotoCapture,

  [MODAL_TYPE.PRIVACY_POLICY]: PrivacyPolicy,
  [MODAL_TYPE.TERMS_OF_SERVICE]: TermsOfService,
  [MODAL_TYPE.COOKIE_POLICY]: CookiePolicy,

  [MODAL_TYPE.TEST]: Test,
})
