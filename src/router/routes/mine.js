import MineProfile from '@/pages/mine/MineProfile.vue'
import MineEarn from '@/pages/mine/MineEarn.vue'

const prefix = 'mine'
export default [
  { name: `${prefix}`, path: `/${prefix}`, component: MineProfile, meta: {} },
  { name: `${prefix}-profile`, path: `/${prefix}/profile`, component: MineProfile, meta: {} },
  { name: `${prefix}-earn`, path: `/${prefix}/earn`, component: MineEarn, meta: {} },
]
