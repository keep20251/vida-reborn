import { MODAL_TYPE } from '@const/index'
import AddCreditCard from '@/components/payment/AddCreditCard.vue'
import ApplyCreatorCert from './ApplyCreatorCert.vue'
import CookiePolicy from './CookiePolicy.vue'
import InterestedPick from './InterestedPick.vue'
import Paying from './Paying.vue'
import PhotoCapture from './PhotoCapture.vue'
import PrivacyPolicy from './PrivacyPolicy.vue'
import Progress from './Progress.vue'
import Report from './Report.vue'
import ShopBuy from './ShopBuy.vue'
import ShopBuySuccess from './ShopBuySuccess.vue'
import SignUpSuccess from './SignUpSuccess.vue'
import SocialLink from './SocialLink.vue'
import Subscribe from './Subscribe.vue'
import SubscribeSuccess from './SubscribeSuccess.vue'
import SubscribeSuccessWithAvatar from './SubscribeSuccessWithAvatar.vue'
import TermsOfService from './TermsOfService.vue'
import Test from './Test.vue'
import Text from './Text.vue'

const obj = {
  [MODAL_TYPE.ALERT]: Text,
  [MODAL_TYPE.CONFIRM]: Text,
  [MODAL_TYPE.PROGRESS]: Progress,

  [MODAL_TYPE.SOCIAL_LINK]: SocialLink,
  [MODAL_TYPE.SIGN_UP_SUCCESS]: SignUpSuccess,
  [MODAL_TYPE.REPORT]: Report,

  [MODAL_TYPE.INTERESTED_PICK]: InterestedPick,
  [MODAL_TYPE.APPLY_CREATOR_CERT]: ApplyCreatorCert,
  [MODAL_TYPE.PHOTO_CAPTURE]: PhotoCapture,

  [MODAL_TYPE.SUBSCRIBE]: Subscribe,
  [MODAL_TYPE.SHOP_BUY]: ShopBuy,
  [MODAL_TYPE.PAYING]: Paying,
  [MODAL_TYPE.SUBSCRIBE_SUCCESS]: SubscribeSuccess,
  [MODAL_TYPE.SUBSCRIBE_SUCCESS_WITH_AVATAR]: SubscribeSuccessWithAvatar,
  [MODAL_TYPE.SHOP_BUY_SUCCESS]: ShopBuySuccess,
  [MODAL_TYPE.ADD_CREDIT_CARD]: AddCreditCard,

  [MODAL_TYPE.PRIVACY_POLICY]: PrivacyPolicy,
  [MODAL_TYPE.TERMS_OF_SERVICE]: TermsOfService,
  [MODAL_TYPE.COOKIE_POLICY]: CookiePolicy,

  [MODAL_TYPE.TEST]: Test,
}

export default Object.freeze(obj)
