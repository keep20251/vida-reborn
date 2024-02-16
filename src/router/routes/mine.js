import MineAboutCP from '@/pages/mine/MineAboutCP.vue'
import MineAboutDMCA from '@/pages/mine/MineAboutDMCA.vue'
import MineAboutPP from '@/pages/mine/MineAboutPP.vue'
import MineAboutTOS from '@/pages/mine/MineAboutTOS.vue'
import MineBeCreator from '@/pages/mine/MineBeCreator.vue'
import MineBuy from '@/pages/mine/MineBuy.vue'
import MineCollect from '@/pages/mine/MineCollect.vue'
import MineEarn from '@/pages/mine/MineEarn.vue'
import MineEarnWdrlHist from '@/pages/mine/MineEarnWdrlHist.vue'
import MineEarnWdrlReq from '@/pages/mine/MineEarnWdrlReq.vue'
import MineHome from '@/pages/mine/MineHome.vue'
import MineMain from '@/pages/mine/MineMain.vue'
import MinePost from '@/pages/mine/MinePost.vue'
import MineProfilePrvw from '@/pages/mine/MineProfilePrvw.vue'
import MineProfileSet from '@/pages/mine/MineProfileSet.vue'
import MineSetAcc from '@/pages/mine/MineSetAcc.vue'
import MineSetBlock from '@/pages/mine/MineSetBlock.vue'
import MineSetDelete from '@/pages/mine/MineSetDelete.vue'
import MineSetPassword from '@/pages/mine/MineSetPassword.vue'
import MineSetPref from '@/pages/mine/MineSetPref.vue'
import Agreement from '@/pages/mine/be-creator/Agreement.vue'
import IdentityAgreement from '@/pages/mine/be-creator/IdentityAgreement.vue'
import TakePicture from '@/pages/mine/be-creator/TakePicture.vue'

const prefix = 'mine'

export default [
  { name: `${prefix}-home`, path: '', component: MineHome, meta: {} },
  { name: `${prefix}-main`, path: 'main', component: MineMain, meta: {} },
  { name: `${prefix}-profile-set`, path: `profile-set`, component: MineProfileSet, meta: {} },
  { name: `${prefix}-profile-prvw`, path: `profile-prvw`, component: MineProfilePrvw, meta: {} },
  { name: `${prefix}-earn`, path: `earn`, component: MineEarn, meta: {} },
  { name: `${prefix}-earn-wdrl-req`, path: `earn-withdrawal-request`, component: MineEarnWdrlReq, meta: {} },
  { name: `${prefix}-earn-wdrl-hist`, path: `earn-withdrawal-history`, component: MineEarnWdrlHist, meta: {} },
  { name: `${prefix}-buy`, path: `buy`, component: MineBuy, meta: {} },
  { name: `${prefix}-post`, path: `post`, component: MinePost, meta: {} },
  { name: `${prefix}-collect`, path: `collect`, component: MineCollect, meta: {} },
  {
    name: `${prefix}-creator`,
    path: `creator`,
    component: MineBeCreator,
    meta: {},
    children: [
      {
        name: `${prefix}-creator-agreement`,
        path: '',
        component: Agreement,
        meta: {},
        beforeEnter: (to, from) => redirectIfNotMatch(to, from, prefix),
      },
      {
        name: `${prefix}-creator-identity-agreement`,
        path: `identity-agreement`,
        component: IdentityAgreement,
        meta: {},
        beforeEnter: (to, from) => redirectIfNotMatch(to, from, `${prefix}-creator-agreement`),
      },
      {
        name: `${prefix}-creator-take-picture`,
        path: `take-picture`,
        component: TakePicture,
        meta: {},
        beforeEnter: (to, from) => redirectIfNotMatch(to, from, `${prefix}-creator-identity-agreement`),
      },
    ],
  },
  { name: `${prefix}-account`, path: `account`, component: MineSetAcc, meta: {} },
  { name: `${prefix}-password`, path: `password`, component: MineSetPassword, meta: {} },
  { name: `${prefix}-preference`, path: `preference`, component: MineSetPref, meta: {} },
  { name: `${prefix}-block`, path: `block`, component: MineSetBlock, meta: {} },
  { name: `${prefix}-delete`, path: `delete`, component: MineSetDelete, meta: {} },
  { name: `${prefix}-tos`, path: `tos`, component: MineAboutTOS, meta: {} },
  { name: `${prefix}-pp`, path: `pp`, component: MineAboutPP, meta: {} },
  { name: `${prefix}-cp`, path: `cp`, component: MineAboutCP, meta: {} },
  { name: `${prefix}-dmca`, path: `dmca`, component: MineAboutDMCA, meta: {} },
]

function redirectIfNotMatch(to, from, routeName) {
  if (from?.name?.includes(routeName)) return true
  return { name: 'mine-home', params: { lang: to.params.lang } }
}
