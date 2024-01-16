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
  { name: `${prefix}`, path: `/${prefix}`, component: MineHome, meta: {} },
  { name: `${prefix}-profile-set`, path: `/${prefix}/profile-set`, component: MineProfileSet, meta: {} },
  { name: `${prefix}-earn`, path: `/${prefix}/earn`, component: MineEarn, meta: {} },
  { name: `${prefix}-buy`, path: `/${prefix}/buy`, component: MineBuy, meta: {} },
  { name: `${prefix}-post`, path: `/${prefix}/post`, component: MinePost, meta: {} },
  { name: `${prefix}-collect`, path: `/${prefix}/collect`, component: MineCollect, meta: {} },
  { name: `${prefix}-creator`, path: `/${prefix}/creator`, component: MineBeCreator, meta: {} },
  { name: `${prefix}-account`, path: `/${prefix}/account`, component: MineSetAcc, meta: {} },
  { name: `${prefix}-password`, path: `/${prefix}/password`, component: MineSetPassword, meta: {} },
  { name: `${prefix}-preference`, path: `/${prefix}/preference`, component: MineSetPref, meta: {} },
  { name: `${prefix}-block`, path: `/${prefix}/block`, component: MineSetBlock, meta: {} },
  { name: `${prefix}-delete`, path: `/${prefix}/delete`, component: MineSetDelete, meta: {} },
  { name: `${prefix}-tos`, path: `/${prefix}/tos`, component: MineAboutTOS, meta: {} },
  { name: `${prefix}-pp`, path: `/${prefix}/pp`, component: MineAboutPP, meta: {} },
  { name: `${prefix}-cp`, path: `/${prefix}/cp`, component: MineAboutCP, meta: {} },
  { name: `${prefix}-dmca`, path: `/${prefix}/dmca`, component: MineAboutDMCA, meta: {} },
]
