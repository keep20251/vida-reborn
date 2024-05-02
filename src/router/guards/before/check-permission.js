import { storeToRefs } from 'pinia'
import { useAccountStore } from '@/store/account'
import { PERM_TABLE } from '@/constant/mine'

/** 如果進入的頁面需要登入狀態 */
export default (to, from) => {
  if (import.meta.env.SSR) {
    return
  }
  if (!to.meta.permissionKey) {
    return
  }

  const { role } = storeToRefs(useAccountStore())
  if (!PERM_TABLE[role.value][to.meta.permissionKey]) {
    return { name: 'mine-home', params: { lang: to.params.lang } }
  }
}
