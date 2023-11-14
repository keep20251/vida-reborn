import { storeToRefs } from 'pinia'
import { NAVS } from '@/constant'
import { useNavStore } from '@/store/nav'
import { usePublishStore } from '@/store/publish'

export default (to, from) => {
  const toNav = NAVS[to.name?.toUpperCase()]
  const fromNav = NAVS[from.name?.toUpperCase()]

  // 進入舊文編輯強制使用滑動進場
  let forceTransitionName
  if ((to.name === 'publish' || from.name === 'publish') && to.name !== from.name) {
    const publishStore = usePublishStore()
    const { isUpdate } = storeToRefs(publishStore)
    if (isUpdate.value) {
      forceTransitionName = to.name === 'publish' ? 'slide-left' : 'slide-right'
    }
  }

  const { changeNav } = useNavStore()
  changeNav(toNav, fromNav, forceTransitionName)
}
