import { useAccountStore } from '@/store/account'

/** 如果進入的頁面需要登入狀態 */
export default (to, from, next) => {
  const accountStore = useAccountStore()

  if (to.meta.checkLogin) {
    accountStore.afterLoginAction(next)()
  } else {
    next()
  }
}
