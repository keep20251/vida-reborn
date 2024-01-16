import MineHome from '@/pages/mine/MineHome.vue'
import MineProfileSet from '@/pages/mine/MineProfileSet.vue'
import MineEarn from '@/pages/mine/MineEarn.vue'
import MineBuy from '@/pages/mine/MineBuy.vue'
import MinePost from '@/pages/mine/MinePost.vue'
import MineCollect from '@/pages/mine/MineCollect.vue'
import MineBeCreator from '@/pages/mine/MineBeCreator.vue'
import MineSetAcc from '@/pages/mine/MineSetAcc.vue'
import MineSetPassword from '@/pages/mine/MineSetPassword.vue'
import MineSetPref from '@/pages/mine/MineSetPref.vue'
import MineSetBlock from '@/pages/mine/MineSetBlock.vue'
import MineSetDelete from '@/pages/mine/MineSetDelete.vue'
import MineAboutTOS from '@/pages/mine/MineAboutTOS.vue'
import MineAboutPP from '@/pages/mine/MineAboutPP.vue'
import MineAboutCP from '@/pages/mine/MineAboutCP.vue'
import MineAboutDMCA from '@/pages/mine/MineAboutDMCA.vue'

const prefix = 'mine'
export default [
  { name: `${prefix}`, path: `/:lang/${prefix}`, component: MineHome, meta: {} },
  { name: `${prefix}-profile-set`, path: `/:lang/${prefix}/profile-set`, component: MineProfileSet, meta: {} },
  { name: `${prefix}-earn`, path: `/:lang/${prefix}/earn`, component: MineEarn, meta: {} },
  { name: `${prefix}-buy`, path: `/:lang/${prefix}/buy`, component: MineBuy, meta: {} },
  { name: `${prefix}-post`, path: `/:lang/${prefix}/post`, component: MinePost, meta: {} },
  { name: `${prefix}-collect`, path: `/:lang/${prefix}/collect`, component: MineCollect, meta: {} },
  { name: `${prefix}-creator`, path: `/:lang/${prefix}/creator`, component: MineBeCreator, meta: {} },
  { name: `${prefix}-account`, path: `/:lang/${prefix}/account`, component: MineSetAcc, meta: {} },
  { name: `${prefix}-password`, path: `/:lang/${prefix}/password`, component: MineSetPassword, meta: {} },
  { name: `${prefix}-preference`, path: `/:lang/${prefix}/preference`, component: MineSetPref, meta: {} },
  { name: `${prefix}-block`, path: `/:lang/${prefix}/block`, component: MineSetBlock, meta: {} },
  { name: `${prefix}-delete`, path: `/:lang/${prefix}/delete`, component: MineSetDelete, meta: {} },
  { name: `${prefix}-tos`, path: `/:lang/${prefix}/tos`, component: MineAboutTOS, meta: {} },
  { name: `${prefix}-pp`, path: `/:lang/${prefix}/pp`, component: MineAboutPP, meta: {} },
  { name: `${prefix}-cp`, path: `/:lang/${prefix}/cp`, component: MineAboutCP, meta: {} },
  { name: `${prefix}-dmca`, path: `/:lang/${prefix}/dmca`, component: MineAboutDMCA, meta: {} },
]
