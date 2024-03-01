import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useAccountStore } from '@/store/account'
import { PERM_TABLE } from '@/constant/mine'

/** 如果進入的頁面需要登入狀態 */
export default (to, from) => {
  // ! 不支援 SSR 跳轉， Vue Router 跟 Pinia 初始化時 useSSRContext 不存在會導致應用崩潰
  if (to.meta.permissionKey && !import.meta.env.SSR) {
    const { role } = storeToRefs(useAccountStore())
    const perm = computed(() => PERM_TABLE[role.value])
    if (!perm.value[to.meta.permissionKey]) return { name: 'mine-home', params: { lang: to.params.lang } }
  }
}
